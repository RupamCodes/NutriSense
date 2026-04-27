import { z } from 'zod';
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export const profileSchema = z.object({
  age: z.number().min(1, 'Age is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  heightCm: z.number().min(50, 'Height is required'),
  weightKg: z.number().min(20, 'Weight is required'),
  activityLevel: z.enum(['SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE']),
  goal: z.enum(['LOSE_WEIGHT', 'GAIN_MUSCLE', 'EAT_HEALTHIER', 'MAINTAIN', 'MANAGE_CONDITION']),
});
export const logMealSchema = z.object({
  foodId: z.string().min(1, 'Please select a food item'),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']),
  servingQuantity: z.number().positive('Quantity must be greater than 0'),
  loggedAt: z.string().optional(),
});
export const createHabitSchema = z.object({
  name: z.string().min(3, 'Habit name must be at least 3 characters'),
  description: z.string().optional(),
  targetFrequency: z.number().min(1, 'Target frequency must be at least 1').max(7, 'Maximum 7 days a week'),
});
