const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const generateToken = require('../src/utils/generateToken');

describe('Authentication & Authorization Security Tests', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should reject registration if fields are missing (Validation Error)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'not-an-email',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('should reject registration if attempting to register as admin (Privilege Escalation)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Hacker User',
          email: 'hacker@example.com',
          password: 'Password123!',
          role: 'admin',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      const hasAdminError = res.body.errors.some((e) =>
        e.msg.toLowerCase().includes('admin account cannot be created')
      );
      expect(hasAdminError).toBe(true);
    });

    it('should reject password with fewer than 6 characters', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Short Password',
          email: 'short@example.com',
          password: '123',
          role: 'candidate',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      const hasLengthError = res.body.errors.some((e) =>
        e.msg.toLowerCase().includes('at least 6 characters')
      );
      expect(hasLengthError).toBe(true);
    });
  });

  describe('Protected Route Token Verification (GET /api/v1/auth/me)', () => {
    it('should return 401 Unauthorized when no Bearer token is provided', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Authentication required');
    });

    it('should return 401 Unauthorized when an invalid token is provided', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid_garbage_token_12345');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid authentication token');
    });
  });

  describe('RBAC Role Restriction', () => {
    it('should deny candidates from creating a company (403 Forbidden)', async () => {
      const candidateToken = generateToken('654321654321654321654321', 'candidate');

      // Mock User.findById so protect middleware attaches candidate user
      jest.spyOn(User, 'findById').mockResolvedValueOnce({
        _id: '654321654321654321654321',
        role: 'candidate',
        isActive: true,
      });

      const res = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          name: 'Unauthorized Tech',
          description: 'A company candidate cannot create',
          location: 'Delhi, India',
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });
  });
});
