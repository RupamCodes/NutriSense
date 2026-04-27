const prisma = require('../config/prisma');
exports.logMeal = async (req, res, next) => {
  try {
    const { name, mealType, items, notes, imageUrl } = req.body;
    if (!name || !mealType || !items || !items.length) {
      return res.status(400).json({ error: 'Name, meal type, and at least one item are required' });
    }
    const totals = items.reduce((acc, item) => ({
      totalCalories: acc.totalCalories + (item.calories || 0),
      totalProteinG: acc.totalProteinG + (item.proteinG || 0),
      totalCarbsG: acc.totalCarbsG + (item.carbsG || 0),
      totalFatG: acc.totalFatG + (item.fatG || 0),
      totalFiberG: acc.totalFiberG + (item.fiberG || 0),
      totalSugarG: acc.totalSugarG + (item.sugarG || 0),
      totalSodiumMg: acc.totalSodiumMg + (item.sodiumMg || 0),
    }), { totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0, totalFiberG: 0, totalSugarG: 0, totalSodiumMg: 0 });
    const meal = await prisma.meal.create({
      data: {
        userId: req.user.id, name, mealType, notes, imageUrl, ...totals,
        items: { create: items.map(i => ({ foodName: i.foodName, brandName: i.brandName, servingQty: i.servingQty || 1, servingUnit: i.servingUnit || 'serving', calories: i.calories || 0, proteinG: i.proteinG || 0, carbsG: i.carbsG || 0, fatG: i.fatG || 0, fiberG: i.fiberG || 0, sugarG: i.sugarG || 0, sodiumMg: i.sodiumMg || 0, thumbnailUrl: i.thumbnailUrl, nxItemId: i.nxItemId, barcode: i.barcode })) },
      },
      include: { items: true },
    });
    res.status(201).json(meal);
  } catch (error) { next(error); }
};
exports.getMeals = async (req, res, next) => {
  try {
    const { startDate, endDate, mealType, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { userId: req.user.id };
    if (startDate || endDate) { where.loggedAt = {}; if (startDate) where.loggedAt.gte = new Date(startDate); if (endDate) where.loggedAt.lte = new Date(endDate); }
    if (mealType) where.mealType = mealType;
    const [meals, total] = await Promise.all([
      prisma.meal.findMany({ where, include: { items: true }, orderBy: { loggedAt: 'desc' }, skip, take: parseInt(limit) }),
      prisma.meal.count({ where }),
    ]);
    res.json({ meals, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) { next(error); }
};
exports.getTodayMeals = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const meals = await prisma.meal.findMany({ where: { userId: req.user.id, loggedAt: { gte: today, lt: tomorrow } }, include: { items: true }, orderBy: { loggedAt: 'asc' } });
    const totals = meals.reduce((acc, m) => ({ calories: acc.calories + m.totalCalories, proteinG: acc.proteinG + m.totalProteinG, carbsG: acc.carbsG + m.totalCarbsG, fatG: acc.fatG + m.totalFatG, fiberG: acc.fiberG + m.totalFiberG }), { calories: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0 });
    res.json({ meals, totals });
  } catch (error) { next(error); }
};
exports.getMealById = async (req, res, next) => {
  try {
    const meal = await prisma.meal.findFirst({ where: { id: req.params.id, userId: req.user.id }, include: { items: true } });
    if (!meal) return res.status(404).json({ error: 'Meal not found' });
    res.json(meal);
  } catch (error) { next(error); }
};
exports.updateMeal = async (req, res, next) => {
  try {
    const existing = await prisma.meal.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Meal not found' });
    const { name, mealType, notes, items } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (mealType) updateData.mealType = mealType;
    if (notes !== undefined) updateData.notes = notes;
    if (items) {
      await prisma.mealItem.deleteMany({ where: { mealId: req.params.id } });
      updateData.items = { create: items.map(i => ({ foodName: i.foodName, brandName: i.brandName, servingQty: i.servingQty || 1, servingUnit: i.servingUnit || 'serving', calories: i.calories || 0, proteinG: i.proteinG || 0, carbsG: i.carbsG || 0, fatG: i.fatG || 0 })) };
      const totals = items.reduce((acc, i) => ({ totalCalories: acc.totalCalories + (i.calories || 0), totalProteinG: acc.totalProteinG + (i.proteinG || 0), totalCarbsG: acc.totalCarbsG + (i.carbsG || 0), totalFatG: acc.totalFatG + (i.fatG || 0) }), { totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0 });
      Object.assign(updateData, totals);
    }
    const meal = await prisma.meal.update({ where: { id: req.params.id }, data: updateData, include: { items: true } });
    res.json(meal);
  } catch (error) { next(error); }
};
exports.deleteMeal = async (req, res, next) => {
  try {
    const existing = await prisma.meal.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Meal not found' });
    await prisma.meal.delete({ where: { id: req.params.id } });
    res.json({ message: 'Meal deleted' });
  } catch (error) { next(error); }
};
