const express = require("express");
const accountsRouter = require("./routes/accounts");
const portfolioRouter = require("./routes/portfolio");
const quotesRouter = require("./routes/quotes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "finance-api", at: new Date().toISOString() });
});

app.get("/version", (req, res) => {
  res.json({
    name: "finance-demo-api",
    version: "1.0.0",
    description: "Sample finance-like API for GitHub CI/CD + SonarQube demos",
  });
});

app.use("/accounts", accountsRouter);
app.use("/portfolio", portfolioRouter);
app.use("/quotes", quotesRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Finance demo API",
    endpoints: [
      "/health",
      "/version",
      "/accounts",
      "/accounts/:id",
      "/accounts/:id/transactions",
      "/portfolio",
      "/quotes?symbol=AAPL",
    ],
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Finance API listening on port ${port}`);
  });
}

module.exports = app;
