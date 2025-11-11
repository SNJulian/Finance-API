const express = require("express");
const { getPortfolio } = require("../services/portfolioService");
const { getQuote } = require("../services/quoteService");

const router = express.Router();

router.get("/", (req, res) => {
  const portfolio = getPortfolio();
  const enriched = portfolio.positions.map((p) => {
    const q = getQuote(p.symbol);
    const price = q ? q.price : null;
    const value = price ? Number((price * p.quantity).toFixed(2)) : null;
    return { ...p, marketPrice: price, marketValue: value, currency: q ? q.currency : portfolio.currency };
  });
  const totalValue = enriched.reduce((sum, p) => sum + (p.marketValue || 0), 0);
  res.json({ owner: portfolio.owner, currency: portfolio.currency, positions: enriched, totalValue });
});

module.exports = router;
