const prisma = require('../config/prisma');
const axios = require('axios');
exports.createMealPlan = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate, entries } = req.body;
    if (!title || !startDate || !endDate) return res.status(400).json({ error: 'Title, startDate, and endDate are required' });
    const plan = await prisma.mealPlan.create({
      data: { userId: req.user.id, title, description, startDate: new Date(startDate), endDate: new Date(endDate), entries: entries ? { create: entries } : undefined },
      include: { entries: true },
    });
    res.status(201).json(plan);
  } catch (error) { next(error); }
};
exports.getMealPlans = async (req, res, next) => {
  try {
    const plans = await prisma.mealPlan.findMany({ where: { userId: req.user.id }, include: { entries: true }, orderBy: { createdAt: 'desc' } });
    res.json(plans);
  } catch (error) { next(error); }
};
exports.getActivePlan = async (req, res, next) => {
  try {
    const plan = await prisma.mealPlan.findFirst({ where: { userId: req.user.id, isActive: true }, include: { entries: { orderBy: [{ dayOfWeek: 'asc' }, { mealType: 'asc' }] } } });
    res.json(plan);
  } catch (error) { next(error); }
};
exports.getMealPlanById = async (req, res, next) => {
  try {
    const plan = await prisma.mealPlan.findFirst({ where: { id: req.params.id, userId: req.user.id }, include: { entries: { orderBy: [{ dayOfWeek: 'asc' }, { mealType: 'asc' }] } } });
    if (!plan) return res.status(404).json({ error: 'Meal plan not found' });
    res.json(plan);
  } catch (error) { next(error); }
};
exports.updateMealPlan = async (req, res, next) => {
  try {
    const existing = await prisma.mealPlan.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Meal plan not found' });
    const plan = await prisma.mealPlan.update({ where: { id: req.params.id }, data: req.body, include: { entries: true } });
    res.json(plan);
  } catch (error) { next(error); }
};
exports.deleteMealPlan = async (req, res, next) => {
  try {
    const existing = await prisma.mealPlan.findFirst({ where: { id: req.params.id, userId: req.user.id } });
    if (!existing) return res.status(404).json({ error: 'Meal plan not found' });
    await prisma.mealPlan.delete({ where: { id: req.params.id } });
    res.json({ message: 'Meal plan deleted' });
  } catch (error) { next(error); }
};
exports.generateAiMealPlan = async (req, res, next) => {
  try {
    const profile = await prisma.userProfile.findUnique({ where: { userId: req.user.id } });
    const goals = await prisma.nutritionGoal.findUnique({ where: { userId: req.user.id } });
    const prompt = `Generate a 7-day meal plan for a person with: Goal: ${profile?.dietaryGoal || 'MAINTAIN_WEIGHT'}, Calories: ${goals?.dailyCalories || 2000}/day, Allergies: ${(profile?.allergies || []).join(', ') || 'none'}, Preferences: ${(profile?.dietaryPrefs || []).join(', ') || 'none'}. Return JSON with entries array: [{dayOfWeek: 0-6, mealType: "BREAKFAST"|"LUNCH"|"DINNER"|"SNACK", title: string, description: string, calories: number, proteinG: number, carbsG: number, fatG: number}]`;
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, { contents: [{ parts: [{ text: prompt }] }] });
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);
    const entries = parsed.entries || parsed;
    const plan = await prisma.mealPlan.create({
      data: { userId: req.user.id, title: 'AI Generated Meal Plan', description: 'Personalized meal plan by NutriSense AI', startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isAiGenerated: true, entries: { create: entries } },
      include: { entries: true },
    });
    res.status(201).json(plan);
  } catch (error) { next(error); }
};
