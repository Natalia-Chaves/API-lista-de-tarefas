// tests/todos.test.js
const request = require("supertest");
const { app } = require("../src/app");
const { prisma } = require("../src/lib/prisma");

// limpa TUDO na ordem certa antes de cada teste
beforeEach(async () => {
  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.deleteMany();
    await tx.todo.deleteMany();
    await tx.user.deleteMany();
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

// helpers
async function createUserAndToken() {
  const email = `user_${Date.now()}@example.com`;
  const password = "SenhaForte123";
  await request(app)
    .post("/auth/register")
    .send({ email, password, name: "Teste" });
  const login = await request(app)
    .post("/auth/login")
    .send({ email, password });
  return { token: login.body.access_token, email };
}

test("POST /todos cria todo (201)", async () => {
  const { token } = await createUserAndToken();

  const res = await request(app)
    .post("/todos")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Estudar Node", priority: 2 });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body.title).toBe("Estudar Node");
});

test("Fluxo update & delete", async () => {
  const { token } = await createUserAndToken();

  const created = await request(app)
    .post("/todos")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Marcar como feito" });

  const id = created.body.id;

  const upd = await request(app)
    .patch(`/todos/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ completed: true });

  expect(upd.status).toBe(200);
  expect(upd.body.completed).toBe(true);

  const del = await request(app)
    .delete(`/todos/${id}`)
    .set("Authorization", `Bearer ${token}`);

  expect(del.status).toBe(204);

  const list = await request(app)
    .get("/todos")
    .set("Authorization", `Bearer ${token}`);

  expect(list.status).toBe(200);
  expect(list.body.items.find((t) => t.id === id)).toBeUndefined();
});

test("Listar com filtro/ordenação/paginação", async () => {
  const { token } = await createUserAndToken();

  await request(app)
    .post("/todos")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Estudar Zod", priority: 1 });
  await request(app)
    .post("/todos")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Fazer café", priority: 3 });
  await request(app)
    .post("/todos")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Estudar Prisma", priority: 2 });

  const res = await request(app)
    .get("/todos?search=Estudar&sort=priority&order=asc&page=1&limit=2")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(res.body.items.length).toBe(2);
  expect(res.body.items[0].priority).toBe(1);
  expect(res.body.items[1].priority).toBe(2);
  expect(res.body.total).toBeGreaterThanOrEqual(2);
});
