const prisma = require('../utils/prisma');
const getHabits = async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({ where: { userId: req.user.id } });
    res.json(habits);
  } catch (error) {
    next(error);
  }
};
const createHabit = async (req, res, next) => {
  try {
    const { name, description, targetFrequency } = req.body;
    const habit = await prisma.habit.create({
      data: {
        userId: req.user.id,
        name,
        description,
        targetFrequency
      }
    });
    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
};
const updateHabit = async (req, res, next) => {
  try {
    const { name, description, targetFrequency } = req.body;
    const habit = await prisma.habit.update({
      where: { id: req.params.id },
      data: { name, description, targetFrequency }
    });
    res.json(habit);
  } catch (error) {
    next(error);
  }
};
const deleteHabit = async (req, res, next) => {
  try {
    await prisma.habit.delete({ where: { id: req.params.id } });
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    next(error);
  }
};
const completeHabit = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await prisma.habitCompletion.findFirst({
      where: {
        habitId: req.params.id,
        completedAt: { gte: today }
      }
    });
    if (existing) {
      return res.json({ message: 'Already completed today', completion: existing });
    }
    const completion = await prisma.habitCompletion.create({
      data: { habitId: req.params.id }
    });
    res.status(201).json(completion);
  } catch (error) {
    next(error);
  }
};
const getStreaks = async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.user.id },
      include: {
        completions: {
          orderBy: { completedAt: 'desc' }
        }
      }
    });
    const streaks = habits.map(habit => {
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      const completions = habit.completions;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (completions.length > 0) {
        let lastDateStr = null;
        let isCurrentActive = true;
        for (let i = 0; i < completions.length; i++) {
          const compDate = new Date(completions[i].completedAt);
          compDate.setHours(0, 0, 0, 0);
          if (lastDateStr === null) {
            tempStreak = 1;
            const diffDays = Math.floor((today - compDate) / (1000 * 60 * 60 * 24));
            if (diffDays > 1) isCurrentActive = false;
          } else {
            const lastDate = new Date(lastDateStr);
            const diffDays = Math.floor((lastDate - compDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
              tempStreak++;
            } else if (diffDays > 1) {
              if (isCurrentActive) {
                currentStreak = tempStreak;
                isCurrentActive = false;
              }
              if (tempStreak > longestStreak) longestStreak = tempStreak;
              tempStreak = 1;
            }
          }
          lastDateStr = compDate.toISOString();
        }
        if (isCurrentActive) currentStreak = tempStreak;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      }
      return {
        habitId: habit.id,
        currentStreak,
        longestStreak,
        lastCompletedAt: completions.length > 0 ? completions[0].completedAt : null
      };
    });
    res.json(streaks);
  } catch (error) {
    next(error);
  }
};
module.exports = { getHabits, createHabit, updateHabit, deleteHabit, completeHabit, getStreaks };
