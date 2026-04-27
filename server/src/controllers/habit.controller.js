const prisma = require('../config/prisma');
exports.createHabit = async (req, res, next) => {
  try {
    const { name, icon, color, frequency, targetCount } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const habit = await prisma.habit.create({ data: { userId: req.user.id, name, icon, color, frequency, targetCount } });
    res.status(201).json(habit);
  } catch (error) { next(error); }
};
exports.getHabits = async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({ where: { userId: req.user.id, isActive: true }, include: { logs: { where: { loggedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }, take: 1 } }, orderBy: { createdAt: 'asc' } });
    res.json(habits);
  } catch (error) { next(error); }
};
exports.updateHabit = async (req, res, next) => {
  try {
    const habit = await prisma.habit.updateMany({ where: { id: req.params.id, userId: req.user.id }, data: req.body });
    if (!habit.count) return res.status(404).json({ error: 'Habit not found' });
    const updated = await prisma.habit.findUnique({ where: { id: req.params.id } });
    res.json(updated);
  } catch (error) { next(error); }
};
exports.deleteHabit = async (req, res, next) => {
  try {
    const result = await prisma.habit.updateMany({ where: { id: req.params.id, userId: req.user.id }, data: { isActive: false } });
    if (!result.count) return res.status(404).json({ error: 'Habit not found' });
    res.json({ message: 'Habit deleted' });
  } catch (error) { next(error); }
};
exports.logHabit = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const log = await prisma.habitLog.upsert({
      where: { habitId_userId_loggedAt: { habitId: req.params.id, userId: req.user.id, loggedAt: today } },
      update: { count: { increment: 1 } },
      create: { habitId: req.params.id, userId: req.user.id, loggedAt: today, count: 1 },
    });
    res.json(log);
  } catch (error) { next(error); }
};
exports.getHabitLogs = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { userId: req.user.id };
    if (startDate || endDate) { where.loggedAt = {}; if (startDate) where.loggedAt.gte = new Date(startDate); if (endDate) where.loggedAt.lte = new Date(endDate); }
    const logs = await prisma.habitLog.findMany({ where, include: { habit: { select: { name: true, icon: true, color: true } } }, orderBy: { loggedAt: 'desc' } });
    res.json(logs);
  } catch (error) { next(error); }
};
exports.getStreak = async (req, res, next) => {
  try {
    const logs = await prisma.habitLog.findMany({ where: { userId: req.user.id }, orderBy: { loggedAt: 'desc' }, select: { loggedAt: true } });
    let streak = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const uniqueDays = [...new Set(logs.map(l => new Date(l.loggedAt).toDateString()))];
    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(today); expected.setDate(expected.getDate() - i);
      if (uniqueDays[i] === expected.toDateString()) streak++;
      else break;
    }
    res.json({ streak });
  } catch (error) { next(error); }
};
