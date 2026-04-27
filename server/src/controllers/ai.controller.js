const geminiService = require('../services/geminiService');
const mealSuggestions = async (req, res, next) => {
  try {
    const result = await geminiService.getMealSuggestions();
    res.json({ suggestions: result });
  } catch (error) {
    next(error);
  }
};
const weeklyPlan = async (req, res, next) => {
  try {
    const result = await geminiService.getWeeklyPlan();
    res.json({ plan: result });
  } catch (error) {
    next(error);
  }
};
const dailyTip = async (req, res, next) => {
  try {
    const tip = await geminiService.getDailyTip();
    res.json({ tip });
  } catch (error) {
    next(error);
  }
};
const analyzeMeal = async (req, res, next) => {
  try {
    const { description } = req.body;
    const analysis = await geminiService.analyzeMeal(description);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
};
const insights = async (req, res, next) => {
  try {
    const { range } = req.query;
    const insightData = await geminiService.getInsights(range);
    res.json({ insights: insightData });
  } catch (error) {
    next(error);
  }
};
module.exports = { mealSuggestions, weeklyPlan, dailyTip, analyzeMeal, insights };
