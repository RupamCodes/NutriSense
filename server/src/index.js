require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const foodsRoutes = require('./routes/foods');
const mealsRoutes = require('./routes/meals');
const analyticsRoutes = require('./routes/analytics');
const plansRoutes = require('./routes/plans');
const habitsRoutes = require('./routes/habits');
const waterRoutes = require('./routes/water');
const aiRoutes = require('./routes/ai');
const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/foods', foodsRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/ai', aiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NutriSense API running on port ${PORT}`);
});
