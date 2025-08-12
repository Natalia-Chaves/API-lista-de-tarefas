const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static('public'));

app.get("/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

module.exports = { app };
