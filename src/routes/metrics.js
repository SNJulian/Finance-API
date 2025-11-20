const express = require('express');
const _ = require('lodash');

const router = express.Router();

/**
 * POST /metrics/portfolio
 * Body: { positions: { symbol: string, quantity: number, price: number }[] }
 * Query: ?topN=3 (optional)
 */
router.post('/portfolio', (req, res) => {
  const { positions } = req.body || {};
  const { topN } = req.query || {};

  if (!Array.isArray(positions) || positions.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message: '`positions` must be a non-empty array'
    });
  }

  const isValidPosition = (p) =>
    p &&
    typeof p.symbol === 'string' &&
    p.symbol.trim().length > 0 &&
    typeof p.quantity === 'number' &&
    Number.isFinite(p.quantity) &&
    typeof p.price === 'number' &&
    Number.isFinite(p.price);

  if (!positions.every(isValidPosition)) {
    return res.status(400).json({
      success: false,
      error: 'BAD_REQUEST',
      message:
        'Each position must have a non-empty `symbol` and numeric `quantity` and `price`'
    });
  }

  // Group by symbol using lodash (this is why we added lodash)
  const grouped = _.groupBy(positions, (p) => p.symbol.trim().toUpperCase());

  let aggregated = Object.keys(grouped).map((symbol) => {
    const group = grouped[symbol];

    const quantity = _.sumBy(group, 'quantity');
    const marketValue = _.sumBy(group, (p) => p.quantity * p.price);
    const averagePrice = marketValue / (quantity || 1);

    return {
      symbol,
      quantity,
      averagePrice,
      marketValue
    };
  });

  // Sort by descending market value
  aggregated = _.orderBy(aggregated, ['marketValue'], ['desc']);

  // Optional topN filter
  let limit = aggregated.length;
  if (typeof topN !== 'undefined') {
    const parsed = parseInt(topN, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      limit = Math.min(parsed, aggregated.length);
    }
  }

  const limitedPositions = aggregated.slice(0, limit);
  const totalMarketValue = _.sumBy(aggregated, 'marketValue');

  return res.status(200).json({
    success: true,
    data: {
      totalMarketValue,
      positions: limitedPositions
    }
  });
});

module.exports = router;
