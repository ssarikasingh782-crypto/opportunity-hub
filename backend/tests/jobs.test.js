const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Job = require('../src/models/Job');
const generateToken = require('../src/utils/generateToken');

describe('Job & Application Endpoints', () => {
  describe('GET /api/v1/jobs (Public Listing)', () => {
    beforeEach(() => {
      // Mock Job queries so tests run hermetically without external MongoDB daemon
      jest.spyOn(Job, 'countDocuments').mockResolvedValue(1);
      jest.spyOn(Job, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            _id: '654321654321654321654321',
            title: 'Full Stack Engineer (MERN)',
            type: 'job',
            workMode: 'remote',
            location: 'Remote',
            salaryMin: 800000,
            salaryMax: 1400000,
            skills: ['React', 'Node.js', 'Express', 'MongoDB'],
            status: 'open',
          },
        ]),
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return 200 with standard pagination envelope', async () => {
      const res = await request(app).get('/api/v1/jobs?page=1&limit=5');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(5);
    });

    it('should support search and filter query parameters', async () => {
      const res = await request(app).get(
        '/api/v1/jobs?search=developer&type=job&workMode=remote&minSalary=400000'
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/jobs (Recruiter Only)', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).post('/api/v1/jobs').send({
        title: 'Backend Node Developer',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject candidate role from posting jobs with 403 Forbidden', async () => {
      const candidateToken = generateToken('654321654321654321654322', 'candidate');

      jest.spyOn(User, 'findById').mockResolvedValueOnce({
        _id: '654321654321654321654322',
        role: 'candidate',
        isActive: true,
      });

      const res = await request(app)
        .post('/api/v1/jobs')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          title: 'Unauthorized Post',
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Access denied');
    });

    it('should validate required fields when recruiter posts job', async () => {
      const recruiterToken = generateToken('654321654321654321654323', 'recruiter');

      jest.spyOn(User, 'findById').mockResolvedValueOnce({
        _id: '654321654321654321654323',
        role: 'recruiter',
        isActive: true,
      });

      const res = await request(app)
        .post('/api/v1/jobs')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          title: 'Ab', // Too short (min 3)
          description: 'Short', // Too short (min 20)
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/jobs/:id/apply (Candidate Only)', () => {
    it('should reject recruiter from applying to jobs with 403 Forbidden', async () => {
      const recruiterToken = generateToken('654321654321654321654324', 'recruiter');

      jest.spyOn(User, 'findById').mockResolvedValueOnce({
        _id: '654321654321654321654324',
        role: 'recruiter',
        isActive: true,
      });

      const res = await request(app)
        .post('/api/v1/jobs/654321654321654321654325/apply')
        .set('Authorization', `Bearer ${recruiterToken}`)
        .send({
          coverLetter: 'I am a recruiter trying to apply',
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should validate invalid MongoDB job ID with 400 Bad Request', async () => {
      const candidateToken = generateToken('654321654321654321654326', 'candidate');

      jest.spyOn(User, 'findById').mockResolvedValueOnce({
        _id: '654321654321654321654326',
        role: 'candidate',
        isActive: true,
      });

      const res = await request(app)
        .post('/api/v1/jobs/invalid-job-id-123/apply')
        .set('Authorization', `Bearer ${candidateToken}`)
        .send({
          coverLetter: 'Applying with bad id',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      const hasIdError = res.body.errors.some((e) => e.msg.includes('Invalid job ID'));
      expect(hasIdError).toBe(true);
    });
  });
});
