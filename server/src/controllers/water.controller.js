const prisma = require('../utils/prisma');
const { startOfDay, endOfDay } = require('date-fns');
const getTodayWater = async (req, res, next) => {
  try {
    const today = new Date();
    const logs = await prisma.waterLog.findMany({
      where: {
        userId: req.user.id,
        loggedAt: {
          gte: startOfDay(today),
          lte: endOfDay(today)
        }
      }
    });
    const totalGlasses = logs.reduce((sum, log) => sum + log.glasses, 0);
    res.json({ totalGlasses, logs });
  } catch (error) {
    next(error);
  }
};
const logWater = async (req, res, next) => {
  try {
    const { glasses } = req.body;
    const log = await prisma.waterLog.create({
      data: {
        userId: req.user.id,
        glasses
      }
    });
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};
module.exports = { getTodayWater, logWater };
