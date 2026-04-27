const calculateTDEE = (profile) => {
  if (!profile.weightKg || !profile.heightCm || !profile.age || !profile.gender || !profile.activityLevel) {
    return 2000;
  }
  let bmr = (10 * profile.weightKg) + (6.25 * profile.heightCm) - (5 * profile.age);
  if (profile.gender === 'MALE') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  const activityMultipliers = {
    SEDENTARY: 1.2,
    LIGHT: 1.375,
    MODERATE: 1.55,
    ACTIVE: 1.725,
    VERY_ACTIVE: 1.9
  };
  const multiplier = activityMultipliers[profile.activityLevel] || 1.2;
  let tdee = Math.round(bmr * multiplier);
  const goalAdjustments = {
    LOSE_WEIGHT: -500,
    GAIN_MUSCLE: 300,
    EAT_HEALTHIER: 0,
    MAINTAIN: 0,
    MANAGE_CONDITION: 0
  };
  const adjustment = goalAdjustments[profile.goal] || 0;
  tdee += adjustment;
  return tdee;
};
module.exports = { calculateTDEE };
