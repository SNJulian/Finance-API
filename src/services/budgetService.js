// src/services/budgetService.js
class BudgetService {
  constructor({ budgetRepository } = {}) {
    // Allow DI for easier testing / replacement later
    this.budgetRepository = budgetRepository || new InMemoryBudgetRepository();
  }

  /**
   * Validate budget for a transaction.
   * @param {Object} payload
   * @param {string} payload.costCenter
   * @param {string} payload.account
   * @param {string} payload.fiscalPeriod  // e.g. "2025-01"
   * @param {number} payload.amount        // requested amount
   * @returns {Promise<{ status, availableAmount, consumedAmount, requestedAmount }>}
   */
  async validateBudget({ costCenter, account, fiscalPeriod, amount }) {
    if (!costCenter || !account || !fiscalPeriod || typeof amount !== 'number') {
      const error = new Error('Missing or invalid required fields.');
      error.statusCode = 400;
      throw error;
    }

    if (amount < 0) {
      const error = new Error('Requested amount must be >= 0.');
      error.statusCode = 400;
      throw error;
    }

    const budget = await this.budgetRepository.getBudget(costCenter, account, fiscalPeriod);

    if (!budget) {
      // Treat unknown budget as 0 available
      return {
        status: 'INSUFFICIENT_BUDGET',
        availableAmount: 0,
        consumedAmount: 0,
        requestedAmount: amount
      };
    }

    const availableAmount = budget.total - budget.consumed;

    const status = amount <= availableAmount ? 'OK' : 'INSUFFICIENT_BUDGET';

    return {
      status,
      availableAmount,
      consumedAmount: budget.consumed,
      requestedAmount: amount
    };
  }
}

/**
 * Very simple in-memory repository implementation.
 * Replace later with DB / external finance system integration.
 */
class InMemoryBudgetRepository {
  constructor() {
    // Example data: { "<costCenter>|<account>|<period>": { total, consumed } }
    this.data = {
      'CC1000|4000|2025-01': { total: 10000, consumed: 2500 },
      'CC1000|4000|2025-02': { total: 8000, consumed: 5000 },
      'CC2000|5000|2025-01': { total: 5000, consumed: 1000 }
    };
  }

  async getBudget(costCenter, account, fiscalPeriod) {
    const key = `${costCenter}|${account}|${fiscalPeriod}`;
    return this.data[key] || null;
  }
}

module.exports = {
  BudgetService,
  InMemoryBudgetRepository
};
