const portfolio = {
  owner: "Demo User",
  currency: "EUR",
  positions: [
    { symbol: "AAPL", quantity: 10, avgCost: 170.0 },
    { symbol: "MSFT", quantity: 5, avgCost: 320.0 },
    { symbol: "SAP", quantity: 12, avgCost: 145.0 },
  ],
};

function getPortfolio() {
  return portfolio;
}

module.exports = { getPortfolio };
