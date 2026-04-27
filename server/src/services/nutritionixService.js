const axios = require('axios');
class NutritionixService {
  constructor() {
    this.appId = process.env.NUTRITIONIX_APP_ID;
    this.apiKey = process.env.NUTRITIONIX_API_KEY;
    this.baseURL = 'https://trackapi.nutritionix.com/v2';
  }
  async searchFoods(query) {
    if (!this.appId || !this.apiKey) {
      console.warn('Nutritionix credentials missing, returning empty array');
      return [];
    }
    try {
      const response = await axios.get(`${this.baseURL}/search/instant`, {
        params: { query },
        headers: {
          'x-app-id': this.appId,
          'x-app-key': this.apiKey,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Nutritionix search error:', error.message);
      return [];
    }
  }
}
module.exports = new NutritionixService();
