const prisma = require('../utils/prisma');
const nutritionixService = require('../services/nutritionixService');
const axios = require('axios');
const searchOpenFoodFacts = async (query) => {
  try {
    const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl`, {
      params: { search_terms: query, search_simple: 1, action: 'process', json: 1, page_size: 10 }
    });
    return (response.data.products || []).map(p => ({
      id: `off_${p._id}`,
      name: p.product_name || 'Unknown Food',
      brand: p.brands || '',
      calories: p.nutriments?.['energy-kcal_100g'] || 0,
      protein: p.nutriments?.proteins_100g || 0,
      carbs: p.nutriments?.carbohydrates_100g || 0,
      fat: p.nutriments?.fat_100g || 0,
      servingSize: p.serving_quantity || 100,
      servingUnit: p.serving_quantity ? (p.serving_quantity_unit || 'g') : 'g',
      source: 'OPEN_FOOD_FACTS'
    }));
  } catch (err) {
    console.error('OpenFoodFacts search error:', err.message);
    return [];
  }
};
const searchFoods = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    let unifiedResults = [];
    const localFoods = await prisma.food.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      take: 10
    });
    unifiedResults = [...localFoods.map(f => ({ ...f, source: 'LOCAL_DB' }))];
    try {
      const nxData = await nutritionixService.searchFoods(q);
      const nxCommon = (nxData.common || []).map(f => ({
        id: `nx_common_${f.food_name}`,
        name: f.food_name,
        brand: '',
        calories: 0, 
        protein: 0, carbs: 0, fat: 0,
        servingSize: f.serving_qty || 1,
        servingUnit: f.serving_unit || 'serving',
        source: 'NUTRITIONIX'
      }));
      const nxBranded = (nxData.branded || []).map(f => ({
        id: `nx_brand_${f.nix_item_id}`,
        name: f.food_name,
        brand: f.brand_name || '',
        calories: f.nf_calories || 0,
        protein: 0, carbs: 0, fat: 0,
        servingSize: f.serving_qty || 1,
        servingUnit: f.serving_unit || 'serving',
        source: 'NUTRITIONIX'
      }));
      unifiedResults = [...unifiedResults, ...nxCommon, ...nxBranded];
    } catch (error) {
      const offResults = await searchOpenFoodFacts(q);
      unifiedResults = [...unifiedResults, ...offResults];
    }
    const seen = new Set();
    const deduped = unifiedResults.filter(item => {
      const key = `${item.name.toLowerCase()}|${item.brand.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    res.json(deduped.slice(0, 20));
  } catch (error) {
    next(error);
  }
};
const getFoodById = async (req, res, next) => {
  try {
    const food = await prisma.food.findUnique({ where: { id: req.params.id } });
    if (!food) return res.status(404).json({ error: 'Food not found' });
    res.json(food);
  } catch (error) {
    next(error);
  }
};
const createCustomFood = async (req, res, next) => {
  try {
    const { name, brand, servingSize, servingUnit, calories, protein, carbs, fat, fiber, sugar, sodium } = req.body;
    const food = await prisma.food.create({
      data: {
        name, brand, servingSize, servingUnit, calories, protein, carbs, fat, fiber, sugar, sodium,
        source: 'CUSTOM'
      }
    });
    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
};
module.exports = { searchFoods, getFoodById, createCustomFood };
