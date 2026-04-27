const prisma = require('../utils/prisma');
const { uploadImage } = require('../services/cloudinaryService');
const { calculateTDEE } = require('../services/tdeeService');
const fs = require('fs');
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    const { age, gender, heightCm, weightKg, activityLevel, goal, dailyWaterTarget } = req.body;
    let { dailyCalorieTarget } = req.body;
    if (!dailyCalorieTarget && age && gender && heightCm && weightKg && activityLevel && goal) {
      dailyCalorieTarget = calculateTDEE({ age, gender, heightCm, weightKg, activityLevel, goal });
    }
    const profile = await prisma.userProfile.upsert({
      where: { userId: req.user.id },
      update: { age, gender, heightCm, weightKg, activityLevel, goal, dailyCalorieTarget, dailyWaterTarget },
      create: { 
        userId: req.user.id, age, gender, heightCm, weightKg, activityLevel, goal, dailyCalorieTarget, dailyWaterTarget,
        dietaryPreferences: [], allergies: []
      }
    });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });
    const imageUrl = await uploadImage(req.file.path);
    fs.unlinkSync(req.file.path); 
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl: imageUrl }
    });
    res.json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    next(error);
  }
};
const updatePreferences = async (req, res, next) => {
  try {
    const { dietaryPreferences, allergies } = req.body;
    const profile = await prisma.userProfile.update({
      where: { userId: req.user.id },
      data: { dietaryPreferences, allergies }
    });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
module.exports = { getMe, updateProfile, updateAvatar, updatePreferences };
