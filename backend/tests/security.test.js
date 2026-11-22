const request = require('supertest');
const app = require('../src/app');

describe('Security Middlewares & Error Handling Tests', () => {
  it('should return 404 for non-existent route with standard error shape', async () => {
    const res = await request(app).get('/api/v1/non-existent-endpoint');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Route not found');
  });

  it('should reject requests exceeding 10kb body payload limit with 413 Payload Too Large', async () => {
    // Generate a payload exceeding 10KB (~15KB string)
    const largePayload = {
      data: 'X'.repeat(15 * 1024),
    };

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(largePayload);

    // 413 Payload Too Large
    expect(res.statusCode).toBe(413);
  });

  it('should include Helmet security headers in HTTP responses', async () => {
    const res = await request(app).get('/health');

    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
