const request = require('supertest');
const app = require('../src/app');

describe('POST /metrics/portfolio', () => {
  it('aggregates positions and returns total market value', async () => {
    const payload = {
      positions: [
        { symbol: 'AAPL', quantity: 10, price: 190.5 },
        { symbol: 'aapl', quantity: 5, price: 191.0 }, // case-insensitive symbol
        { symbol: 'TSLA', quantity: 3, price: 230.0 }
      ]
    };

    const res = await request(app)
      .post('/metrics/portfolio')
      .send(payload)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalMarketValue');
    expect(res.body.data.positions.length).toBe(2);

    const aapl = res.body.data.positions.find((p) => p.symbol === 'AAPL');
    const tsla = res.body.data.positions.find((p) => p.symbol === 'TSLA');

    expect(aapl.quantity).toBe(15);
    expect(tsla.quantity).toBe(3);
  });

  it('respects topN query parameter', async () => {
    const payload = {
      positions: [
        { symbol: 'A', quantity: 1, price: 10 },
        { symbol: 'B', quantity: 1, price: 20 },
        { symbol: 'C', quantity: 1, price: 30 }
      ]
    };

    const res = await request(app)
      .post('/metrics/portfolio?topN=2')
      .send(payload)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.positions.length).toBe(2);

    // Positions should be sorted by market value desc, so C then B or B then A etc.
    const symbols = res.body.data.positions.map((p) => p.symbol);
    expect(symbols).toContain('C');
  });

  it('returns 400 when positions is missing or empty', async () => {
    const res = await request(app)
      .post('/metrics/portfolio')
      .send({})
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('BAD_REQUEST');
  });

  it('returns 400 when a position is invalid', async () => {
    const res = await request(app)
      .post('/metrics/portfolio')
      .send({
        positions: [
          { symbol: 'AAPL', quantity: 10, price: 190.5 },
          { symbol: '', quantity: 'NaN', price: 10 }
        ]
      })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('BAD_REQUEST');
  });
});
