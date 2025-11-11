const quotes = {
  AAPL: { symbol: "AAPL", price: 190.2, currency: "USD", ts: new Date().toISOString() },
  MSFT: { symbol: "MSFT", price: 405.1, currency: "USD", ts: new Date().toISOString() },
  SAP: { symbol: "SAP", price: 160.5, currency: "EUR", ts: new Date().toISOString() },
};

function getQuote(symbol) {
  if (!symbol) return null;
  const upper = symbol.toUpperCase();
  return quotes[upper] || null;
}

module.exports = { getQuote };
