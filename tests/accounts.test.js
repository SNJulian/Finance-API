const request = require("supertest");
const app = require("../src/app");

describe("Accounts API", () => {
  it("should list accounts", async () => {
    const res = await request(app).get("/accounts");
    expect(res.statusCode).toBe(200);
  });

  it("should create a transaction", async () => {
    const res = await request(app)
      .post("/accounts/1/transactions")
      .send({ type: "credit", amount: 50, description: "test credit" });
    expect(res.statusCode).toBe(201);
  });
});
