const prisma = require('../utils/prisma');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const getTodayMeals = async (req, res, next) => {
  try {
    const today = new Date();
    const meals = await prisma.mealLog.findMany({
      where: {
        userId: req.user.id,
        loggedAt: {
          gte: startOfDay(today),
          lte: endOfDay(today)
        }
      },
      include: { food: true }
    });
    res.json(meals);
  } catch (error) {
    next(error);
  }
};
const getMealsByDateRange = async (req, res, next) => {
  try {
    const { date, range } = req.query;
    const filterDate = date ? parseISO(date) : new Date();
    const meals = await prisma.mealLog.findMany({
      where: {
        userId: req.user.id,
        loggedAt: {
          gte: startOfDay(filterDate),
          lte: endOfDay(filterDate)
        }
      },
      include: { food: true }
    });
    res.json(meals);
  } catch (error) {
    next(error);
  }
};
const logMeal = async (req, res, next) => {
  try {
    const { foodId, mealType, servingQuantity, loggedAt } = req.body;
    const meal = await prisma.mealLog.create({
      data: {
        userId: req.user.id,
        foodId,
        mealType,
        servingQuantity,
        loggedAt: loggedAt ? new Date(loggedAt) : new Date()
      },
      include: { food: true }
    });
    res.status(201).json(meal);
  } catch (error) {
    next(error);
  }
};
const deleteMeal = async (req, res, next) => {
  try {
    const meal = await prisma.mealLog.findUnique({ where: { id: req.params.id } });
    if (!meal || meal.userId !== req.user.id) {
      return res.status(404).json({ error: 'Meal not found or unauthorized' });
    }
    await prisma.mealLog.delete({ where: { id: req.params.id } });
    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    next(error);
  }
};
const getMealsSummary = async (req, res, next) => {
  try {
    const { date } = req.query;
    const filterDate = date ? parseISO(date) : new Date();
    const meals = await prisma.mealLog.findMany({
      where: {
        userId: req.user.id,
        loggedAt: {
          gte: startOfDay(filterDate),
          lte: endOfDay(filterDate)
        }
      },
      include: { food: true }
    });
    const summary = meals.reduce((acc, log) => {
      const multiplier = log.servingQuantity / log.food.servingSize;
      acc.totalCalories += log.food.calories * multiplier;
      acc.protein += log.food.protein * multiplier;
      acc.carbs += log.food.carbs * multiplier;
      acc.fat += log.food.fat * multiplier;
      if (!acc.byMealType[log.mealType]) acc.byMealType[log.mealType] = 0;
      acc.byMealType[log.mealType] += log.food.calories * multiplier;
      return acc;
    }, { totalCalories: 0, protein: 0, carbs: 0, fat: 0, byMealType: {} });
    res.json(summary);
  } catch (error) {
    next(error);
  }
};
module.exports = { getTodayMeals, getMealsByDateRange, logMeal, deleteMeal, getMealsSummary };
