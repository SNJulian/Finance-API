const request = require("supertest");
const app = require("../src/app");

describe("Finance API base", () => {
  it("GET / should list endpoints", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("endpoints");
  });
});
