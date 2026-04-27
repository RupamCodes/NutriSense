const axios = require('axios');
const NUTRITIONIX_BASE = 'https://trackapi.nutritionix.com/v2';
const OFF_BASE = 'https://world.openfoodfacts.org/api/v0';
exports.searchFood = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Search query required' });
    try {
      const response = await axios.get(`${NUTRITIONIX_BASE}/search/instant`, {
        params: { query },
        headers: { 'x-app-id': process.env.NUTRITIONIX_APP_ID, 'x-app-key': process.env.NUTRITIONIX_APP_KEY },
      });
      const common = (response.data.common || []).slice(0, 10).map(f => ({ foodName: f.food_name, thumbnailUrl: f.photo?.thumb, servingUnit: f.serving_unit, servingQty: f.serving_qty, source: 'nutritionix' }));
      const branded = (response.data.branded || []).slice(0, 10).map(f => ({ foodName: f.food_name, brandName: f.brand_name, thumbnailUrl: f.photo?.thumb, servingUnit: f.serving_unit, servingQty: f.serving_qty, calories: f.nf_calories, nxItemId: f.nix_item_id, source: 'nutritionix' }));
      return res.json({ common, branded });
    } catch {
      const response = await axios.get(`${OFF_BASE}/search`, { params: { search_terms: query, page_size: 10, json: 1 } });
      const products = (response.data.products || []).map(p => ({ foodName: p.product_name || 'Unknown', brandName: p.brands, thumbnailUrl: p.image_small_url, calories: p.nutriments?.['energy-kcal_100g'], proteinG: p.nutriments?.proteins_100g, carbsG: p.nutriments?.carbohydrates_100g, fatG: p.nutriments?.fat_100g, barcode: p.code, source: 'openfoodfacts' }));
      return res.json({ common: products, branded: [] });
    }
  } catch (error) { next(error); }
};
exports.lookupBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    try {
      const response = await axios.get(`${OFF_BASE}/product/${barcode}`);
      if (response.data.status === 1) {
        const p = response.data.product;
        return res.json({ foodName: p.product_name, brandName: p.brands, calories: p.nutriments?.['energy-kcal_100g'], proteinG: p.nutriments?.proteins_100g, carbsG: p.nutriments?.carbohydrates_100g, fatG: p.nutriments?.fat_100g, fiberG: p.nutriments?.fiber_100g, sugarG: p.nutriments?.sugars_100g, servingSize: p.serving_size, thumbnailUrl: p.image_small_url, barcode });
      }
      return res.status(404).json({ error: 'Product not found' });
    } catch { return res.status(404).json({ error: 'Product not found' }); }
  } catch (error) { next(error); }
};
exports.parseNaturalLanguage = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });
    const response = await axios.post(`${NUTRITIONIX_BASE}/natural/nutrients`, { query }, { headers: { 'x-app-id': process.env.NUTRITIONIX_APP_ID, 'x-app-key': process.env.NUTRITIONIX_APP_KEY, 'Content-Type': 'application/json' } });
    const foods = (response.data.foods || []).map(f => ({ foodName: f.food_name, brandName: f.brand_name, servingQty: f.serving_qty, servingUnit: f.serving_unit, calories: f.nf_calories, proteinG: f.nf_protein, carbsG: f.nf_total_carbohydrate, fatG: f.nf_total_fat, fiberG: f.nf_dietary_fiber, sugarG: f.nf_sugars, sodiumMg: f.nf_sodium, thumbnailUrl: f.photo?.thumb }));
    res.json({ foods });
  } catch (error) { next(error); }
};
