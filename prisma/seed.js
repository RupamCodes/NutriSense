const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const foods = [
  { name: 'Oatmeal', brand: 'Quaker', servingSize: 40, servingUnit: 'g', calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, sugar: 1 },
  { name: 'Eggs, large', brand: null, servingSize: 50, servingUnit: 'g', calories: 72, protein: 6, carbs: 0.4, fat: 4.8, fiber: 0, sugar: 0.2 },
  { name: 'Greek Yogurt, non-fat', brand: 'Chobani', servingSize: 170, servingUnit: 'g', calories: 90, protein: 16, carbs: 6, fat: 0, fiber: 0, sugar: 4 },
  { name: 'Banana', brand: null, servingSize: 118, servingUnit: 'g', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14.4 },
  { name: 'Whole Wheat Toast', brand: 'Nature\'s Own', servingSize: 26, servingUnit: 'g', calories: 60, protein: 3, carbs: 11, fat: 1, fiber: 2, sugar: 1 },
  { name: 'Almond Butter', brand: 'Justin\'s', servingSize: 32, servingUnit: 'g', calories: 190, protein: 7, carbs: 6, fat: 18, fiber: 3, sugar: 2 },
  { name: 'Blueberries', brand: null, servingSize: 148, servingUnit: 'g', calories: 84, protein: 1.1, carbs: 21.4, fat: 0.5, fiber: 3.6, sugar: 14.7 },
  { name: 'Bacon', brand: 'Oscar Mayer', servingSize: 16, servingUnit: 'g', calories: 70, protein: 5, carbs: 0, fat: 6, fiber: 0, sugar: 0 },
  { name: 'Pancakes, plain', brand: 'Aunt Jemima', servingSize: 40, servingUnit: 'g', calories: 150, protein: 4, carbs: 32, fat: 1, fiber: 1, sugar: 5 },
  { name: 'Maple Syrup', brand: null, servingSize: 60, servingUnit: 'ml', calories: 210, protein: 0, carbs: 53, fat: 0, fiber: 0, sugar: 53 },
  { name: 'Chia Seeds', brand: 'Navitas', servingSize: 28, servingUnit: 'g', calories: 138, protein: 4.7, carbs: 11.9, fat: 8.7, fiber: 9.8, sugar: 0 },
  { name: 'Milk, 2%', brand: null, servingSize: 240, servingUnit: 'ml', calories: 122, protein: 8.1, carbs: 12, fat: 4.8, fiber: 0, sugar: 12 },
  { name: 'Chicken Breast, grilled', brand: null, servingSize: 140, servingUnit: 'g', calories: 231, protein: 43.4, carbs: 0, fat: 5, fiber: 0, sugar: 0 },
  { name: 'Brown Rice, cooked', brand: null, servingSize: 195, servingUnit: 'g', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7 },
  { name: 'Broccoli, steamed', brand: null, servingSize: 156, servingUnit: 'g', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, fiber: 5.1, sugar: 2.2 },
  { name: 'Avocado', brand: null, servingSize: 150, servingUnit: 'g', calories: 240, protein: 3, carbs: 12.8, fat: 22, fiber: 10, sugar: 1 },
  { name: 'Turkey Breast, sliced', brand: 'Boar\'s Head', servingSize: 56, servingUnit: 'g', calories: 50, protein: 11, carbs: 1, fat: 0.5, fiber: 0, sugar: 0 },
  { name: 'Whole Wheat Wrap', brand: 'Mission', servingSize: 70, servingUnit: 'g', calories: 210, protein: 8, carbs: 35, fat: 5, fiber: 4, sugar: 1 },
  { name: 'Mixed Greens', brand: null, servingSize: 30, servingUnit: 'g', calories: 5, protein: 0.5, carbs: 1, fat: 0.1, fiber: 0.6, sugar: 0.2 },
  { name: 'Olive Oil', brand: 'Filippo Berio', servingSize: 15, servingUnit: 'ml', calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0, sugar: 0 },
  { name: 'Quinoa, cooked', brand: null, servingSize: 185, servingUnit: 'g', calories: 222, protein: 8.1, carbs: 39.4, fat: 3.6, fiber: 5.2, sugar: 1.6 },
  { name: 'Black Beans, canned', brand: 'Goya', servingSize: 130, servingUnit: 'g', calories: 120, protein: 8, carbs: 22, fat: 0, fiber: 8, sugar: 0 },
  { name: 'Sweet Potato, baked', brand: null, servingSize: 200, servingUnit: 'g', calories: 180, protein: 4, carbs: 41, fat: 0.3, fiber: 6.6, sugar: 13 },
  { name: 'Tuna, canned in water', brand: 'Starkist', servingSize: 113, servingUnit: 'g', calories: 100, protein: 22, carbs: 0, fat: 1, fiber: 0, sugar: 0 },
  { name: 'Salmon, baked', brand: null, servingSize: 170, servingUnit: 'g', calories: 350, protein: 38, carbs: 0, fat: 21, fiber: 0, sugar: 0 },
  { name: 'Asparagus, roasted', brand: null, servingSize: 134, servingUnit: 'g', calories: 27, protein: 3, carbs: 5.2, fat: 0.2, fiber: 2.8, sugar: 1.6 },
  { name: 'Ground Beef, 90% lean', brand: null, servingSize: 113, servingUnit: 'g', calories: 200, protein: 22, carbs: 0, fat: 11, fiber: 0, sugar: 0 },
  { name: 'Pasta, cooked', brand: 'Barilla', servingSize: 140, servingUnit: 'g', calories: 220, protein: 8, carbs: 43, fat: 1, fiber: 2.5, sugar: 0.8 },
  { name: 'Marinara Sauce', brand: 'Rao\'s', servingSize: 125, servingUnit: 'g', calories: 100, protein: 2, carbs: 4, fat: 7, fiber: 1, sugar: 3 },
  { name: 'Tofu, firm', brand: 'Nasoya', servingSize: 85, servingUnit: 'g', calories: 80, protein: 8, carbs: 2, fat: 4.5, fiber: 1, sugar: 0 },
  { name: 'Brussels Sprouts, roasted', brand: null, servingSize: 156, servingUnit: 'g', calories: 67, protein: 5.3, carbs: 14, fat: 0.5, fiber: 6, sugar: 3.4 },
  { name: 'Pork Chop, bone-in', brand: null, servingSize: 170, servingUnit: 'g', calories: 350, protein: 35, carbs: 0, fat: 22, fiber: 0, sugar: 0 },
  { name: 'Mashed Potatoes', brand: null, servingSize: 210, servingUnit: 'g', calories: 237, protein: 4, carbs: 35, fat: 8.9, fiber: 3.1, sugar: 2.8 },
  { name: 'Green Beans, steamed', brand: null, servingSize: 125, servingUnit: 'g', calories: 44, protein: 2.4, carbs: 9.9, fat: 0.3, fiber: 4, sugar: 4.5 },
  { name: 'Lentils, cooked', brand: null, servingSize: 198, servingUnit: 'g', calories: 230, protein: 17.9, carbs: 39.9, fat: 0.8, fiber: 15.6, sugar: 3.6 },
  { name: 'Shrimp, cooked', brand: null, servingSize: 113, servingUnit: 'g', calories: 112, protein: 24, carbs: 0, fat: 1.2, fiber: 0, sugar: 0 },
  { name: 'Apple, medium', brand: null, servingSize: 182, servingUnit: 'g', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19 },
  { name: 'Almonds', brand: 'Blue Diamond', servingSize: 28, servingUnit: 'g', calories: 170, protein: 6, carbs: 5, fat: 15, fiber: 3, sugar: 1 },
  { name: 'String Cheese', brand: 'Sargento', servingSize: 24, servingUnit: 'g', calories: 80, protein: 7, carbs: 1, fat: 6, fiber: 0, sugar: 0 },
  { name: 'Carrot Sticks', brand: null, servingSize: 100, servingUnit: 'g', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, sugar: 4.7 },
  { name: 'Hummus', brand: 'Sabra', servingSize: 28, servingUnit: 'g', calories: 70, protein: 2, carbs: 4, fat: 5, fiber: 1, sugar: 0 },
  { name: 'Protein Bar', brand: 'Quest', servingSize: 60, servingUnit: 'g', calories: 200, protein: 21, carbs: 22, fat: 8, fiber: 14, sugar: 1 },
  { name: 'Rice Cakes', brand: 'Quaker', servingSize: 9, servingUnit: 'g', calories: 35, protein: 1, carbs: 7, fat: 0, fiber: 0, sugar: 0 },
  { name: 'Peanut Butter', brand: 'Jif', servingSize: 32, servingUnit: 'g', calories: 190, protein: 7, carbs: 8, fat: 16, fiber: 2, sugar: 3 },
  { name: 'Cottage Cheese', brand: 'Daisy', servingSize: 113, servingUnit: 'g', calories: 110, protein: 13, carbs: 4, fat: 4.5, fiber: 0, sugar: 4 },
  { name: 'Grapes', brand: null, servingSize: 151, servingUnit: 'g', calories: 104, protein: 1.1, carbs: 27.3, fat: 0.2, fiber: 1.4, sugar: 23.4 },
  { name: 'Dark Chocolate, 70%', brand: 'Lindt', servingSize: 30, servingUnit: 'g', calories: 180, protein: 2.5, carbs: 13, fat: 13, fiber: 3.5, sugar: 8.5 },
  { name: 'Protein Shake', brand: 'Premier Protein', servingSize: 325, servingUnit: 'ml', calories: 160, protein: 30, carbs: 5, fat: 3, fiber: 1, sugar: 1 },
  { name: 'Spinach, raw', brand: null, servingSize: 30, servingUnit: 'g', calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1 },
  { name: 'Walnuts', brand: null, servingSize: 28, servingUnit: 'g', calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9, sugar: 0.7 },
  { name: 'Strawberries', brand: null, servingSize: 152, servingUnit: 'g', calories: 49, protein: 1, carbs: 11.7, fat: 0.5, fiber: 3, sugar: 7.4 },
  { name: 'Orange', brand: null, servingSize: 131, servingUnit: 'g', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1, sugar: 12.2 },
  { name: 'Edamame', brand: null, servingSize: 155, servingUnit: 'g', calories: 188, protein: 18.5, carbs: 13.8, fat: 8.1, fiber: 8.1, sugar: 3.4 },
  { name: 'Cashews', brand: null, servingSize: 28, servingUnit: 'g', calories: 157, protein: 5.2, carbs: 8.6, fat: 12.4, fiber: 0.9, sugar: 1.7 },
  { name: 'Pumpkin Seeds', brand: null, servingSize: 28, servingUnit: 'g', calories: 151, protein: 7, carbs: 5, fat: 13, fiber: 1.7, sugar: 0.3 },
  { name: 'Cauliflower', brand: null, servingSize: 100, servingUnit: 'g', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, sugar: 1.9 },
  { name: 'Cucumber', brand: null, servingSize: 104, servingUnit: 'g', calories: 16, protein: 0.7, carbs: 3.8, fat: 0.1, fiber: 0.5, sugar: 1.7 },
  { name: 'Tomatoes', brand: null, servingSize: 149, servingUnit: 'g', calories: 27, protein: 1.3, carbs: 5.8, fat: 0.3, fiber: 1.8, sugar: 3.9 },
  { name: 'Bell Pepper', brand: null, servingSize: 119, servingUnit: 'g', calories: 24, protein: 1, carbs: 5.5, fat: 0.2, fiber: 2, sugar: 2.9 },
  { name: 'Mushroom', brand: null, servingSize: 70, servingUnit: 'g', calories: 15, protein: 2.2, carbs: 2.3, fat: 0.2, fiber: 0.7, sugar: 1.4 },
];
async function main() {
  console.log('Start seeding...');
  await prisma.food.deleteMany({});
  console.log('Cleared existing foods.');
  for (const food of foods) {
    await prisma.food.create({
      data: food
    });
  }
  console.log(`Seeded ${foods.length} foods.`);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
