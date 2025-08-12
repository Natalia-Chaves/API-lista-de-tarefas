const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prisma");
const { registerSchema, loginSchema } = require("../schemas/auth");

const {
  signAccessToken,
  issueRefresh,
  rotateRefresh,
  isValidRefresh,
  revokeAllUserRefreshTokens,
} = require("../lib/tokens");

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "ValidationError",
      details: parsed.error.flatten(),
    });
  }

  const { email, password, name } = parsed.data;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "EmailAlreadyUsed" });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, name },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "InternalError" });
  }
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "ValidationError",
      details: parsed.error.flatten(),
    });
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "InvalidCredentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "InvalidCredentials" });

    const accessToken = signAccessToken(user.id);

    // emite e persiste refresh
    const ua = req.headers["user-agent"] || null;
    const ip = req.ip || req.connection?.remoteAddress || null;
    const { refreshToken, expiresAt } = await issueRefresh(user.id, ua, ip);

    // opcional: também setar cookie httpOnly (útil pra navegador)
    res.cookie?.("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true em produção com HTTPS
      maxAge: Number(process.env.REFRESH_TTL_DAYS || 7) * 24 * 60 * 60 * 1000,
    });

    return res.json({
      token_type: "Bearer",
      access_token: accessToken,
      expires_in: 15 * 60,
      refresh_token: refreshToken, // também no corpo pra facilitar teste
      refresh_expires_at: expiresAt.toISOString(),
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "InternalError" });
  }
}

async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.userId) },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "NotFound" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "InternalError" });
  }
}

async function refresh(req, res) {
  try {
    const provided =
      req.cookies?.refresh_token ||
      req.body?.refresh_token ||
      req.headers["x-refresh-token"];

    if (!provided)
      return res.status(400).json({ error: "MissingRefreshToken" });

    const secret = process.env.REFRESH_SECRET || process.env.JWT_SECRET;
    const payload = jwt.verify(provided, secret); // lança se inválido/expirado

    const userId = Number(payload.sub);
    const oldJti = payload.jti;
    if (!oldJti) return res.status(400).json({ error: "InvalidRefreshToken" });

    const valid = await isValidRefresh(oldJti, userId);
    if (!valid)
      return res.status(401).json({ error: "RefreshRevokedOrExpired" });

    const ua = req.headers["user-agent"] || null;
    const ip = req.ip || req.connection?.remoteAddress || null;
    const { refreshToken, expiresAt } = await rotateRefresh(
      oldJti,
      userId,
      ua,
      ip
    );
    const accessToken = signAccessToken(userId);

    res.cookie?.("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: Number(process.env.REFRESH_TTL_DAYS || 7) * 24 * 60 * 60 * 1000,
    });

    return res.json({
      token_type: "Bearer",
      access_token: accessToken,
      expires_in: 15 * 60,
      refresh_token: refreshToken,
      refresh_expires_at: expiresAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ error: "InvalidOrExpiredRefresh", message: err.message });
  }
}

async function logout(req, res) {
  try {
    // essa rota estará protegida pelo middleware auth, então temos req.userId
    const userId = Number(req.userId);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await revokeAllUserRefreshTokens(userId);
    res.clearCookie?.("refresh_token");

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "InternalError", message: err.message });
  }
}

module.exports = { register, login, me, refresh, logout };
