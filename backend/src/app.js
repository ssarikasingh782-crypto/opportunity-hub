const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const apiV1Routes = require('./routes');
const { getHealthStatus } = require('./controllers/health.controller');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// 1. Security Headers with Helmet
app.use(helmet());

// 2. CORS Configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || origin === allowedOrigin) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked request from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Rate Limiting (100 requests per 15 minutes window)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// 4. Request Logging with Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 5. Body Parsing with strict 10kb limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// 7. Health Route (accessible at top level /health and under /api/v1/health)
app.get('/health', getHealthStatus);

// 8. Mount REST API Version 1
app.use('/api/v1', apiV1Routes);

// 9. Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Job & Internship Portal API is active',
    version: '1.0.0',
    docs: '/api/v1/health',
  });
});

// 10. Handle 404 & Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
