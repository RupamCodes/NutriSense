const prisma = require('../config/prisma');
exports.createList = async (req, res, next) => {
  try {
    const { title, items } = req.body;
    const list = await prisma.shoppingList.create({ data: { userId: req.user.id, title: title || 'Shopping List', items: items ? { create: items } : undefined }, include: { items: true } });
    res.status(201).json(list);
  } catch (error) { next(error); }
};
exports.getLists = async (req, res, next) => {
  try {
    const lists = await prisma.shoppingList.findMany({ where: { userId: req.user.id }, include: { items: true }, orderBy: { createdAt: 'desc' } });
    res.json(lists);
  } catch (error) { next(error); }
};
exports.getListById = async (req, res, next) => {
  try {
    const list = await prisma.shoppingList.findFirst({ where: { id: req.params.id, userId: req.user.id }, include: { items: true } });
    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json(list);
  } catch (error) { next(error); }
};
exports.updateList = async (req, res, next) => {
  try {
    const list = await prisma.shoppingList.updateMany({ where: { id: req.params.id, userId: req.user.id }, data: { title: req.body.title } });
    if (!list.count) return res.status(404).json({ error: 'List not found' });
    res.json(await prisma.shoppingList.findUnique({ where: { id: req.params.id }, include: { items: true } }));
  } catch (error) { next(error); }
};
exports.deleteList = async (req, res, next) => {
  try {
    const existing = await prisma.shoppingList.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'List not found' });
    await prisma.shoppingList.delete({ where: { id: req.params.id } });
    res.json({ message: 'List deleted' });
  } catch (error) { next(error); }
};
exports.addItem = async (req, res, next) => {
  try {
    const { name, quantity, category } = req.body;
    const item = await prisma.shoppingListItem.create({ data: { listId: req.params.id, name, quantity, category } });
    res.status(201).json(item);
  } catch (error) { next(error); }
};
exports.toggleItem = async (req, res, next) => {
  try {
    const item = await prisma.shoppingListItem.findUnique({ where: { id: req.params.itemId } });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    const updated = await prisma.shoppingListItem.update({ where: { id: req.params.itemId }, data: { isChecked: !item.isChecked } });
    res.json(updated);
  } catch (error) { next(error); }
};
exports.deleteItem = async (req, res, next) => {
  try {
    await prisma.shoppingListItem.delete({ where: { id: req.params.itemId } });
    res.json({ message: 'Item removed' });
  } catch (error) { next(error); }
};
exports.generateFromMealPlan = async (req, res, next) => {
  try {
    const plan = await prisma.mealPlan.findFirst({ where: { id: req.params.planId, userId: req.user.id }, include: { entries: true } });
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
    const ingredients = plan.entries.flatMap(e => (e.recipe || '').split('\n').filter(l => l.trim()));
    const list = await prisma.shoppingList.create({
      data: { userId: req.user.id, title: `Shopping: ${plan.title}`, items: { create: ingredients.map(name => ({ name: name.trim(), category: 'Groceries' })) } },
      include: { items: true },
    });
    res.status(201).json(list);
  } catch (error) { next(error); }
};
