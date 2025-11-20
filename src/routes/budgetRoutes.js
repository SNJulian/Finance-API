// src/routes/budgetRoutes.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { BudgetService } = require('../services/budgetService');

const router = express.Router();
const budgetService = new BudgetService();

// POST /budget/validate
router.post('/budget/validate', async (req, res) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();

  try {
    const { costCenter, account, fiscalPeriod, amount } = req.body;

    const result = await budgetService.validateBudget({
      costCenter,
      account,
      fiscalPeriod,
      amount
    });

    return res.status(200).json({
      status: result.status,
      availableAmount: result.availableAmount,
      consumedAmount: result.consumedAmount,
      requestedAmount: result.requestedAmount,
      correlationId
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
      error: err.message || 'Unexpected error during budget validation.',
      correlationId
    });
  }
});

module.exports = router;
