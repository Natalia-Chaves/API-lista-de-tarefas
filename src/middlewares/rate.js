// src/middlewares/rate.js
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

// Em dev e teste, não queremos limitar
const isProd = process.env.NODE_ENV === "production";
const skipLimiter = () => !isProd;

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: isProd ? 10 : 1_000_000,
  skip: skipLimiter,                  // ← pula limiter em dev/test
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    return res.status(429).json({
      error: "TooManyRequests",
      retry_after_seconds: Math.ceil(options.windowMs / 1000),
    });
  },
});

const userLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: isProd ? 300 : 1_000_000,
  keyGenerator: (req) => (req.userId ? `user:${req.userId}` : ipKeyGenerator(req)),
  skip: skipLimiter,                  // ← pula limiter em dev/test
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: "TooManyRequests" }),
});

module.exports = { authLimiter, userLimiter };
