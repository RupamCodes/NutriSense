const prisma = require('../utils/prisma');
const { subDays, subMonths } = require('date-fns');
const getRangeDate = (range) => {
  const now = new Date();
  if (range === 'month') return subMonths(now, 1);
  if (range === '3months') return subMonths(now, 3);
  return subDays(now, 7); 
};
const getMacros = async (req, res, next) => {
  try {
    const startDate = getRangeDate(req.query.range);
    const logs = await prisma.mealLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: startDate } },
      include: { food: true }
    });
    let protein = 0, carbs = 0, fat = 0;
    logs.forEach(log => {
      const mult = log.servingQuantity / log.food.servingSize;
      protein += log.food.protein * mult;
      carbs += log.food.carbs * mult;
      fat += log.food.fat * mult;
    });
    res.json({ protein, carbs, fat, startDate });
  } catch (error) {
    next(error);
  }
};
const getCalories = async (req, res, next) => {
  try {
    const startDate = getRangeDate(req.query.range);
    const logs = await prisma.mealLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: startDate } },
      include: { food: true }
    });
    const trend = logs.map(l => ({ date: l.loggedAt, calories: l.food.calories * (l.servingQuantity / l.food.servingSize) }));
    res.json(trend);
  } catch (error) {
    next(error);
  }
};
const getNutrients = async (req, res, next) => {
  try {
    const startDate = getRangeDate(req.query.range);
    const logs = await prisma.mealLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: startDate } },
      include: { food: true }
    });
    let fiber = 0, sugar = 0, sodium = 0;
    logs.forEach(log => {
      const mult = log.servingQuantity / log.food.servingSize;
      fiber += log.food.fiber * mult;
      sugar += log.food.sugar * mult;
      sodium += log.food.sodium * mult;
    });
    res.json({ fiber, sugar, sodium, startDate });
  } catch (error) {
    next(error);
  }
};
const getTopFoods = async (req, res, next) => {
  try {
    const startDate = getRangeDate(req.query.range);
    const logs = await prisma.mealLog.findMany({
      where: { userId: req.user.id, loggedAt: { gte: startDate } },
      include: { food: true }
    });
    const counts = {};
    logs.forEach(l => {
      if (!counts[l.food.name]) counts[l.food.name] = { count: 0, food: l.food };
      counts[l.food.name].count += 1;
    });
    const top = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
    res.json(top);
  } catch (error) {
    next(error);
  }
};
module.exports = { getMacros, getCalories, getNutrients, getTopFoods };
