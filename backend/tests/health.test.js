const request = require('supertest');
const app = require('../src/app');

describe('Health Check Endpoints', () => {
  it('GET /health should return 200 and operational server status', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.server).toBe('operational');
    expect(res.body.data.environment).toBeDefined();
    expect(res.body.data.database).toBeDefined();
  });

  it('GET /api/v1/health should return 200 with standard response envelope', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('health check passed');
    expect(res.body.data.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});
