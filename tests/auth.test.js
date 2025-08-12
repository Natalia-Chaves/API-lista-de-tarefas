// tests/auth.test.js
const request = require("supertest");
const { app } = require("../src/app");
const { prisma } = require("../src/lib/prisma");

// limpa TUDO na ordem certa (filhos -> pais) antes de CADA teste
beforeEach(async () => {
  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.deleteMany();
    await tx.todo.deleteMany();
    await tx.user.deleteMany();
  });
});

// fecha conexão do Prisma no fim
afterAll(async () => {
  await prisma.$disconnect();
});

// helpers
async function createUserViaApi() {
  const email = `user_${Date.now()}@example.com`;
  const password = "SenhaForte123";
  await request(app)
    .post("/auth/register")
    .send({ email, password, name: "Teste" });
  return { email, password };
}

async function loginAndGetToken(email, password) {
  const res = await request(app).post("/auth/login").send({ email, password });
  return {
    access: res.body.access_token,
    refresh: res.body.refresh_token,
    body: res.body,
  };
}

// testes
test("POST /auth/register cria usuário (201)", async () => {
  const email = `user_${Date.now()}@example.com`;
  const res = await request(app)
    .post("/auth/register")
    .send({ email, password: "SenhaForte123", name: "Teste" });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body.email).toBe(email);
});

test("POST /auth/login retorna token (200)", async () => {
  const { email, password } = await createUserViaApi();

  const res = await request(app).post("/auth/login").send({ email, password });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("access_token");
  expect(res.body.token_type).toBe("Bearer");
  expect(res.body.expires_in).toBeGreaterThan(0);
  expect(res.body.user.email).toBe(email);
});

test("POST /auth/login com senha errada -> 401", async () => {
  const { email } = await createUserViaApi();

  const res = await request(app)
    .post("/auth/login")
    .send({ email, password: "Errada123" });

  expect(res.status).toBe(401);
  expect(res.body.error).toBe("InvalidCredentials");
});

test("GET /auth/me sem token -> 401", async () => {
  const res = await request(app).get("/auth/me");
  expect(res.status).toBe(401);
  expect(res.body.error).toBe("Unauthorized");
  expect(res.body.reason).toBe("MissingBearerToken");
});

test("GET /auth/me com token -> 200", async () => {
  const { email, password } = await createUserViaApi();
  const { access } = await loginAndGetToken(email, password);

  const res = await request(app)
    .get("/auth/me")
    .set("Authorization", `Bearer ${access}`);

  expect(res.status).toBe(200);
  expect(res.body.email).toBe(email);
});

test("POST /auth/refresh rotaciona e invalida o refresh antigo", async () => {
  const { email, password } = await createUserViaApi();
  const first = await request(app)
    .post("/auth/login")
    .send({ email, password });
  const oldAccess = first.body.access_token;
  const oldRefresh = first.body.refresh_token;

  const ref = await request(app)
    .post("/auth/refresh")
    .send({ refresh_token: oldRefresh });
  expect(ref.status).toBe(200);

  const newAccess = ref.body.access_token;
  const newRefresh = ref.body.refresh_token;
  expect(newAccess).not.toBe(oldAccess);
  expect(newRefresh).not.toBe(oldRefresh);

  const reuse = await request(app)
    .post("/auth/refresh")
    .send({ refresh_token: oldRefresh });
  expect(reuse.status).toBe(401);
});

test("POST /auth/logout revoga todos os refresh tokens do usuário", async () => {
  const { email, password } = await createUserViaApi();
  const first = await request(app)
    .post("/auth/login")
    .send({ email, password });
  const access = first.body.access_token;
  const refresh = first.body.refresh_token;

  const pre = await request(app)
    .post("/auth/refresh")
    .send({ refresh_token: refresh });
  expect(pre.status).toBe(200);
  const access2 = pre.body.access_token;
  const refresh2 = pre.body.refresh_token;

  const out = await request(app)
    .post("/auth/logout")
    .set("Authorization", `Bearer ${access2}`);
  expect(out.status).toBe(204);

  const after = await request(app)
    .post("/auth/refresh")
    .send({ refresh_token: refresh2 });
  expect(after.status).toBe(401);

  const me = await request(app)
    .get("/auth/me")
    .set("Authorization", `Bearer ${access2}`);
  expect(me.status).toBe(200);
});
