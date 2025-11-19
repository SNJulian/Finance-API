const request = require('supertest');
const app = require('../src/app');

describe('POST /analytics/correlation', () => {
  it('returns correlation for valid numeric arrays', async () => {
    const payload = {
      x: [0.01, 0.02, -0.01, 0.03],
      y: [0.005, 0.018, -0.004, 0.025]
    };

    const res = await request(app)
      .post('/analytics/correlation')
      .send(payload)
      .expect(200);

    expect(res.body).toHaveProperty('correlation');
    expect(typeof res.body.correlation).toBe('number');
    expect(res.body.length).toBe(payload.x.length);
  });

  it('returns 400 if x or y is not an array', async () => {
    const res = await request(app)
      .post('/analytics/correlation')
      .send({ x: 'not-an-array', y: [1, 2, 3] })
      .expect(400);

    expect(res.body).toHaveProperty('error', 'BAD_REQUEST');
  });

  it('returns 400 if x and y have different lengths', async () => {
    const res = await request(app)
      .post('/analytics/correlation')
      .send({ x: [1, 2, 3], y: [1, 2] })
      .expect(400);

    expect(res.body).toHaveProperty('error', 'BAD_REQUEST');
  });

  it('returns 400 if arrays are too short', async () => {
    const res = await request(app)
      .post('/analytics/correlation')
      .send({ x: [1], y: [1] })
      .expect(400);

    expect(res.body).toHaveProperty('error', 'BAD_REQUEST');
  });

  it('returns 400 if arrays contain non-numeric values', async () => {
    const res = await request(app)
      .post('/analytics/correlation')
      .send({ x: [1, 'a', 3], y: [1, 2, 3] })
      .expect(400);

    expect(res.body).toHaveProperty('error', 'BAD_REQUEST');
  });
});
