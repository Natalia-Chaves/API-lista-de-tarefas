const { z } = require("zod");

const createTodoSchema = z.object({
  title: z.string().trim().min(1, "title é obrigatório"),
  completed: z.boolean().optional(),
  priority: z.number().int().min(1).max(3).optional(), // 1 alta, 2 média, 3 baixa
  dueDate: z.coerce.date().optional(), // aceita string ISO e converte p/ Date
});

const updateTodoSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    completed: z.boolean().optional(),
    priority: z.number().int().min(1).max(3).optional(),
    dueDate: z.coerce.date().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie ao menos um campo para atualizar",
  });

const listTodosQuerySchema = z.object({
  search: z.string().trim().optional(),
  completed: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
  priority: z
    .preprocess(
      (v) => (v === undefined ? undefined : Number(v)),
      z.number().int().min(1).max(3)
    )
    .optional(),
  sort: z
    .enum([
      "createdAt",
      "updatedAt",
      "priority",
      "title",
      "completed",
      "dueDate",
    ])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

module.exports = { createTodoSchema, updateTodoSchema, listTodosQuerySchema };
