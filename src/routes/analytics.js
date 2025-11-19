const express = require('express');
const ss = require('simple-statistics');

const router = express.Router();

/**
 * POST /analytics/correlation
 * Body: { x: number[], y: number[] }
 */
router.post('/correlation', (req, res) => {
  const { x, y } = req.body || {};

  // Basic shape checks
  if (!Array.isArray(x) || !Array.isArray(y)) {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: '`x` and `y` must both be arrays of numbers'
    });
  }

  if (x.length !== y.length) {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: '`x` and `y` must have the same length'
    });
  }

  if (x.length < 2) {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: '`x` and `y` must contain at least 2 values'
    });
  }

  // Type / value checks
  const isNumericArray = (arr) =>
    arr.every(
      (v) =>
        typeof v === 'number' &&
        Number.isFinite(v)
    );

  if (!isNumericArray(x) || !isNumericArray(y)) {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: '`x` and `y` must only contain finite numbers'
    });
  }

  try {
    const correlation = ss.sampleCorrelation(x, y);

    // Handle potential NaN from the library
    if (!Number.isFinite(correlation)) {
      return res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'Unable to compute correlation for the provided values'
      });
    }

    return res.status(200).json({
      correlation,
      length: x.length
    });
  } catch (err) {
    return res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: 'Failed to compute correlation'
    });
  }
});

module.exports = router;
