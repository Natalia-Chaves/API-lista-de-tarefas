const express = require("express");
const router = express.Router();

const {
  register,
  login,
  me,
  refresh,
  logout,
} = require("../controllers/authController");
const { auth } = require("../middlewares/auth");
const { authLimiter } = require("../middlewares/rate");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", auth, me);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", auth, logout);

module.exports = router;
