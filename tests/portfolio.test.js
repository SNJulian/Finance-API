const request = require("supertest");
const app = require("../src/app");

describe("Portfolio API", () => {
  it("GET /portfolio should return portfolio", async () => {
    const res = await request(app).get("/portfolio");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("positions");
  });
});
