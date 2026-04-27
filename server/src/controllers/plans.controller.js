const prisma = require('../utils/prisma');
const getCurrentPlan = async (req, res, next) => {
  try {
    const plan = await prisma.mealPlan.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { entries: { include: { food: true } } }
    });
    res.json(plan);
  } catch (error) {
    next(error);
  }
};
const createPlan = async (req, res, next) => {
  try {
    const { weekStartDate } = req.body;
    const plan = await prisma.mealPlan.create({
      data: {
        userId: req.user.id,
        weekStartDate: new Date(weekStartDate)
      }
    });
    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
};
const upsertPlanEntry = async (req, res, next) => {
  try {
    res.json({ message: 'Entry upserted' });
  } catch (error) {
    next(error);
  }
};
const deletePlanEntry = async (req, res, next) => {
  try {
    await prisma.mealPlanEntry.delete({
      where: { id: req.params.entryId }
    });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    next(error);
  }
};
const getShoppingList = async (req, res, next) => {
  try {
    const plan = await prisma.mealPlan.findUnique({
      where: { id: req.params.id },
      include: { entries: { include: { food: true } } }
    });
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
    const categories = {
      Produce: ['apple', 'banana', 'spinach', 'carrot', 'tomato', 'lettuce', 'broccoli', 'onion', 'garlic', 'potato', 'berry'],
      Proteins: ['chicken', 'beef', 'fish', 'egg', 'tofu', 'lentil', 'pork', 'salmon', 'turkey', 'bean'],
      Grains: ['rice', 'bread', 'pasta', 'oat', 'quinoa', 'cereal', 'wheat', 'tortilla'],
      Dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream']
    };
    const getCategory = (foodName) => {
      const lower = foodName.toLowerCase();
      for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some(kw => lower.includes(kw))) {
          return cat;
        }
      }
      return 'Other';
    };
    const agg = {};
    plan.entries.forEach(entry => {
      const food = entry.food;
      if (!food) return;
      const cat = getCategory(food.name);
      const key = `${cat}|${food.name}|${food.servingUnit}`;
      if (!agg[key]) {
        agg[key] = {
          category: cat,
          name: food.name,
          totalQuantity: 0,
          unit: food.servingUnit
        };
      }
      agg[key].totalQuantity += entry.quantity || 1;
    });
    const grouped = Object.values(agg).reduce((acc, item) => {
      let group = acc.find(g => g.category === item.category);
      if (!group) {
        group = { category: item.category, items: [] };
        acc.push(group);
      }
      group.items.push({ name: item.name, totalQuantity: item.totalQuantity, unit: item.unit });
      return acc;
    }, []);
    res.json({ shoppingList: grouped });
  } catch (error) {
    next(error);
  }
};
module.exports = { getCurrentPlan, createPlan, upsertPlanEntry, deletePlanEntry, getShoppingList };
