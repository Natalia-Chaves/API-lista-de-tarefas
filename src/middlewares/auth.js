const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ error: "Unauthorized", reason: "MissingBearerToken" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = Number(payload.sub);
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized", reason: "InvalidOrExpiredToken" });
  }
}

module.exports = { auth };
