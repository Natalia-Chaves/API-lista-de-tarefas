const { z } = require("zod");

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "mínimo 8 caracteres"),
    name: z.string().trim().min(1).max(60).optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

module.exports = {
    registerSchema,
    loginSchema,
}