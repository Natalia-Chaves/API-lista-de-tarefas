// src/lib/tokens.js
const jwt = require("jsonwebtoken");
const { prisma } = require("./prisma");
const { randomUUID } = require("crypto");

function signAccessToken(userId) {
  const secret = process.env.JWT_SECRET;
  // jti garante que um novo access token seja diferente, mesmo no mesmo segundo
  return jwt.sign({ sub: String(userId), jti: randomUUID() }, secret, {
    expiresIn: "15m",
  });
}

function signRefreshToken(jti, userId) {
  const secret = process.env.REFRESH_SECRET || process.env.JWT_SECRET;
  return jwt.sign({ sub: String(userId), jti }, secret, {
    expiresIn: `${process.env.REFRESH_TTL_DAYS || 7}d`,
  });
}

async function issueRefresh(userId, ua, ip) {
  const jti = randomUUID();
  const token = signRefreshToken(jti, userId);
  const days = Number(process.env.REFRESH_TTL_DAYS || 7);
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: { jti, token, userId, userAgent: ua, ip, expiresAt: expires },
  });

  return { refreshToken: token, jti, expiresAt: expires };
}

async function rotateRefresh(oldJti, userId, ua, ip) {
  await prisma.refreshToken.updateMany({
    where: { jti: oldJti, userId, isRevoked: false },
    data: { isRevoked: true, revokedAt: new Date() },
  });
  return issueRefresh(userId, ua, ip);
}

async function isValidRefresh(jti, userId) {
  const rt = await prisma.refreshToken.findFirst({
    where: { jti, userId, isRevoked: false, expiresAt: { gt: new Date() } },
  });
  return !!rt;
}

async function revokeAllUserRefreshTokens(userId) {
  await prisma.refreshToken.updateMany({
    where: { userId, isRevoked: false },
    data: { isRevoked: true, revokedAt: new Date() },
  });
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  issueRefresh,
  rotateRefresh,
  isValidRefresh,
  revokeAllUserRefreshTokens,
};
