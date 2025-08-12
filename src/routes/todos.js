const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  createTodo,
  listTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const { userLimiter } = require("../middlewares/rate");


router.use(auth, userLimiter); // todas exigem Bearer
router.post("/", createTodo); // criar
router.get("/", listTodos); // listar
router.get("/:id", getTodo); // detalhe
router.patch("/:id", updateTodo); // atualizar parcial
router.delete("/:id", deleteTodo); // apagar

module.exports = router;
