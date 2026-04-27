const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const mealRoutes = require('./routes/meal.routes');
const nutritionRoutes = require('./routes/nutrition.routes');
const habitRoutes = require('./routes/habit.routes');
const mealPlanRoutes = require('./routes/mealPlan.routes');
const aiRoutes = require('./routes/ai.routes');
const shoppingRoutes = require('./routes/shopping.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts, please try again later.' },
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'nutrisense-api',
    version: '1.0.0',
  });
});
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
module.exports = app;
