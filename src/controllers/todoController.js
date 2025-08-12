const { prisma } = require("../lib/prisma");
const {
  createTodoSchema,
  updateTodoSchema,
  listTodosQuerySchema,
} = require("../schemas/todo");

// POST /todos
async function createTodo(req, res) {
  const parsed = createTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "ValidationError", details: parsed.error.flatten() });
  }
  const data = parsed.data;

  try {
    const todo = await prisma.todo.create({
      data: {
        title: data.title,
        completed: data.completed ?? false,
        priority: data.priority ?? null,
        dueDate: data.dueDate ?? null,
        userId: req.userId, // vem do middleware auth
      },
      select: {
        id: true,
        title: true,
        completed: true,
        priority: true,
        dueDate: true,
        createdAt: true,
      },
    });
    return res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "InternalError" });
  }
}

// GET /todos (lista do usuário)
async function listTodos(req, res) {
  const parsed = listTodosQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "ValidationError", details: parsed.error.flatten() });
  }
  const { search, completed, priority, sort, order, page, limit } = parsed.data;

  const where = { userId: req.userId };
  if (typeof completed === "boolean") where.completed = completed;
  if (priority !== undefined) where.priority = priority;
  if (search) {
    where.title = { contains: search };
  }

  const [items, total] = await Promise.all([
    prisma.todo.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        completed: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.todo.count({ where }),
  ]);

  return res.json({
    items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    sort,
    order,
  });
}

// GET /todos/:id (verifica dono)
async function getTodo(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "InvalidId" });

  const todo = await prisma.todo.findFirst({
    where: { id, userId: req.userId },
    select: {
      id: true,
      title: true,
      completed: true,
      priority: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!todo) return res.status(404).json({ error: "NotFound" });
  return res.json(todo);
}

// PATCH /todos/:id
async function updateTodo(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "InvalidId" });

  const parsed = updateTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "ValidationError", details: parsed.error.flatten() });
  }

  // garante que pertence ao usuário
  const exists = await prisma.todo.findFirst({
    where: { id, userId: req.userId },
  });
  if (!exists) return res.status(404).json({ error: "NotFound" });

  try {
    const updated = await prisma.todo.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        title: true,
        completed: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "InternalError" });
  }
}

// DELETE /todos/:id
async function deleteTodo(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "InvalidId" });

  const exists = await prisma.todo.findFirst({
    where: { id, userId: req.userId },
  });
  if (!exists) return res.status(404).json({ error: "NotFound" });

  try {
    await prisma.todo.delete({ where: { id } });
    return res.status(204).send(); // sem corpo
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "InternalError" });
  }
}

module.exports = { createTodo, listTodos, getTodo, updateTodo, deleteTodo };
