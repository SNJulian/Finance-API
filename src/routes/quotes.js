const express = require("express");
const { getQuote } = require("../services/quoteService");

const router = express.Router();

router.get("/", (req, res) => {
  const { symbol } = req.query;
  const quote = getQuote(symbol);
  if (!quote) return res.status(404).json({ error: "Quote not found" });
  res.json(quote);
});

module.exports = router;
