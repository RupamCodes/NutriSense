class GeminiParseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeminiParseError';
  }
}
const callGeminiAPI = async (systemPrompt, userPrompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      response_mime_type: "application/json",
    }
  };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errorData}`);
    }
    const data = await response.json();
    let textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      throw new Error('Invalid response structure from Gemini API');
    }
    textContent = textContent.trim();
    if (textContent.startsWith('```json')) {
      textContent = textContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (textContent.startsWith('```')) {
      textContent = textContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    try {
      return JSON.parse(textContent);
    } catch (parseError) {
      throw new GeminiParseError(`Failed to parse Gemini response as JSON: ${parseError.message}\nResponse: ${textContent}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Gemini API request timed out after 10 seconds');
    }
    throw error;
  }
};
const getMealSuggestions = async (context) => {
  const {
    mealType, timeOfDay, todayCaloriesConsumed, dailyCalorieTarget,
    goal, dietaryPreferences, allergies, availableIngredients, mood
  } = context;
  const remaining = (dailyCalorieTarget || 2000) - (todayCaloriesConsumed || 0);
  const systemPrompt = "You are a certified nutritionist AI. Return only valid JSON. No markdown, no explanation, no preamble.";
  const userPrompt = `User profile:
- Goal: ${goal || 'maintain'}
- Daily calorie target: ${dailyCalorieTarget || 2000} kcal
- Consumed today: ${todayCaloriesConsumed || 0} kcal
- Remaining: ${remaining} kcal
- Dietary preferences: ${(dietaryPreferences && dietaryPreferences.length) ? dietaryPreferences.join(', ') : 'none'}
- Allergies: ${(allergies && allergies.length) ? allergies.join(', ') : 'none'}
- Available ingredients: ${availableIngredients || 'not specified'}
- Current mood: ${mood || 'neutral'}
- Meal type: ${mealType || 'snack'} at ${timeOfDay || 'any time'}
Suggest exactly 3 healthy meal options that fit within the remaining calories.
Return a JSON array of 3 objects, each with:
{
  "name": "string",
  "description": "string (1-2 sentences)",
  "estimatedCalories": 0,
  "protein_g": 0,
  "carbs_g": 0,
  "fat_g": 0,
  "prepTimeMinutes": 0,
  "ingredients": ["string"],
  "whyThisFits": "string (1 sentence)",
  "recipe": ["string"]
}`;
  return await callGeminiAPI(systemPrompt, userPrompt);
};
const generateWeeklyPlan = async (userProfile) => {
  const systemPrompt = "You are a certified nutritionist AI. Return only valid JSON. No markdown, no explanation, no preamble.";
  const userPrompt = `Generate a 7-day weekly meal plan based on this user profile:
${JSON.stringify(userProfile, null, 2)}
Return a JSON object exactly matching this structure:
{
  "weekPlan": {
    "monday": { "breakfast": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "lunch": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "dinner": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "snack": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 } },
    "tuesday": { "breakfast": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "lunch": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "dinner": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "snack": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 } },
    "wednesday": { "breakfast": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "lunch": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "dinner": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "snack": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 } },
    "thursday": { "breakfast": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "lunch": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "dinner": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "snack": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 } },
    "friday": { "breakfast": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "lunch": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "dinner": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "snack": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 } },
    "saturday": { "breakfast": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "lunch": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "dinner": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "snack": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 } },
    "sunday": { "breakfast": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "lunch": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "dinner": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 }, "snack": { "name": "", "description": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 } }
  },
  "totalCaloriesPerDay": { "monday": 0, "tuesday": 0, "wednesday": 0, "thursday": 0, "friday": 0, "saturday": 0, "sunday": 0 },
  "shoppingList": [ { "category": "string", "items": ["string"] } ]
}`;
  return await callGeminiAPI(systemPrompt, userPrompt);
};
const getDailyTip = async (todaysSummary) => {
  const systemPrompt = "You are a certified nutritionist AI. Return only valid JSON. No markdown, no explanation, no preamble.";
  const userPrompt = `Provide a daily tip based on today's summary:
${JSON.stringify(todaysSummary, null, 2)}
Return a JSON object:
{
  "tip": "string (max 2 sentences)",
  "type": "positive" | "warning" | "suggestion"
}`;
  return await callGeminiAPI(systemPrompt, userPrompt);
};
const analyzeMeal = async ({ description }) => {
  const systemPrompt = "You are a certified nutritionist AI. Return only valid JSON. No markdown, no explanation, no preamble.";
  const userPrompt = `Estimate the nutritional content for this meal description:
"${description}"
Return a JSON object exactly matching this structure:
{
  "name": "string",
  "estimatedCalories": 0,
  "protein_g": 0,
  "carbs_g": 0,
  "fat_g": 0,
  "fiber_g": 0,
  "confidence": "high" | "medium" | "low",
  "notes": "string"
}`;
  return await callGeminiAPI(systemPrompt, userPrompt);
};
const getInsights = async (analyticsData) => {
  const systemPrompt = "You are a certified nutritionist AI. Return only valid JSON. No markdown, no explanation, no preamble.";
  const userPrompt = `Generate exactly 3 insights based on this analytics data:
${JSON.stringify(analyticsData, null, 2)}
Return a JSON array of exactly 3 objects matching this structure:
[
  {
    "insight": "string",
    "type": "positive" | "warning" | "suggestion",
    "metric": "string"
  }
]`;
  return await callGeminiAPI(systemPrompt, userPrompt);
};
module.exports = {
  GeminiParseError,
  getMealSuggestions,
  generateWeeklyPlan,
  getDailyTip,
  analyzeMeal,
  getInsights
};
