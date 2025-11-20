// tests/budgetService.test.js
const { BudgetService, InMemoryBudgetRepository } = require('../src/services/budgetService');

describe('BudgetService.validateBudget', () => {
  test('returns OK when there is enough budget', async () => {
    const repo = new InMemoryBudgetRepository();
    // Override data so test is deterministic
    repo.data = {
      'CC1000|4000|2025-01': { total: 10000, consumed: 2500 }
    };

    const service = new BudgetService({ budgetRepository: repo });

    const result = await service.validateBudget({
      costCenter: 'CC1000',
      account: '4000',
      fiscalPeriod: '2025-01',
      amount: 1000
    });

    expect(result.status).toBe('OK');
    expect(result.availableAmount).toBe(7500);
    expect(result.consumedAmount).toBe(2500);
    expect(result.requestedAmount).toBe(1000);
  });

  test('returns INSUFFICIENT_BUDGET when there is not enough budget', async () => {
    const repo = new InMemoryBudgetRepository();
    repo.data = {
      'CC1000|4000|2025-01': { total: 3000, consumed: 2500 }
    };

    const service = new BudgetService({ budgetRepository: repo });

    const result = await service.validateBudget({
      costCenter: 'CC1000',
      account: '4000',
      fiscalPeriod: '2025-01',
      amount: 1000
    });

    expect(result.status).toBe('INSUFFICIENT_BUDGET');
    expect(result.availableAmount).toBe(500);
  });

  test('returns INSUFFICIENT_BUDGET when no budget record exists', async () => {
    const repo = new InMemoryBudgetRepository();
    repo.data = {}; // force empty

    const service = new BudgetService({ budgetRepository: repo });

    const result = await service.validateBudget({
      costCenter: 'UNKNOWN',
      account: '4000',
      fiscalPeriod: '2025-01',
      amount: 100
    });

    expect(result.status).toBe('INSUFFICIENT_BUDGET');
    expect(result.availableAmount).toBe(0);
  });

  test('throws 400 error when required fields are missing', async () => {
    const service = new BudgetService();

    await expect(
      service.validateBudget({
        costCenter: 'CC1000',
        // account missing
        fiscalPeriod: '2025-01',
        amount: 100
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  test('throws 400 error when amount is negative', async () => {
    const service = new BudgetService();

    await expect(
      service.validateBudget({
        costCenter: 'CC1000',
        account: '4000',
        fiscalPeriod: '2025-01',
        amount: -1
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});
