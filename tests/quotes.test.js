const request = require("supertest");
const app = require("../src/app");

describe("Quotes API", () => {
  it("GET /quotes?symbol=AAPL should return quote", async () => {
    const res = await request(app).get("/quotes?symbol=AAPL");
    expect(res.statusCode).toBe(200);
  });
});
