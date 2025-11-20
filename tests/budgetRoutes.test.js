// tests/budgetRoutes.test.js
const request = require('supertest');
const app = require('../src/app'); // adjust path if your app file is different

describe('POST /api/budget/validate', () => {
  test('returns OK with correlationId when budget is sufficient', async () => {
    const response = await request(app)
      .post('/api/budget/validate')
      .set('x-correlation-id', 'test-corr-id-123')
      .send({
        costCenter: 'CC1000',
        account: '4000',
        fiscalPeriod: '2025-01',
        amount: 100
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.requestedAmount).toBe(100);
    expect(response.body.correlationId).toBe('test-corr-id-123');
    expect(response.body).toHaveProperty('availableAmount');
    expect(response.body).toHaveProperty('consumedAmount');
  });

  test('returns INSUFFICIENT_BUDGET when amount exceeds available amount', async () => {
    const response = await request(app)
      .post('/api/budget/validate')
      .send({
        costCenter: 'CC1000',
        account: '4000',
        fiscalPeriod: '2025-02',
        amount: 10000 // likely too high vs in-memory example
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('INSUFFICIENT_BUDGET');
    expect(response.body.correlationId).toBeDefined();
  });

  test('returns 400 and correlationId for invalid request', async () => {
    const response = await request(app)
      .post('/api/budget/validate')
      .send({
        // Missing account, amount, etc.
        costCenter: 'CC1000'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.correlationId).toBeDefined();
  });
});
