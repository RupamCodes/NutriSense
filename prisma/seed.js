const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SAMPLE_USER_ID = 'sample-user-id';

const foods = [
  { name: 'Oatmeal', brand: 'Quaker', servingSize: 40, servingUnit: 'g', calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, sugar: 1 },
  { name: 'Eggs, large', brand: null, servingSize: 50, servingUnit: 'g', calories: 72, protein: 6, carbs: 0.4, fat: 4.8, fiber: 0, sugar: 0.2 },
  { name: 'Greek Yogurt, non-fat', brand: 'Chobani', servingSize: 170, servingUnit: 'g', calories: 90, protein: 16, carbs: 6, fat: 0, fiber: 0, sugar: 4 },
  { name: 'Banana', brand: null, servingSize: 118, servingUnit: 'g', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14.4 },
  { name: 'Whole Wheat Toast', brand: 'Nature\'s Own', servingSize: 26, servingUnit: 'g', calories: 60, protein: 3, carbs: 11, fat: 1, fiber: 2, sugar: 1 },
];

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.mealLog.deleteMany({});
  await prisma.userProfile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.food.deleteMany({});

  console.log('Cleared existing data.');

  // Create foods and store their IDs
  const createdFoods = [];
  for (const food of foods) {
    const f = await prisma.food.create({
      data: food
    });
    createdFoods.push(f);
  }
  console.log(`Seeded ${createdFoods.length} foods.`);

  // Create sample user
  const user = await prisma.user.create({
    data: {
      id: SAMPLE_USER_ID,
      email: 'sample@nutrisense.com',
      name: 'Sample User',
      profile: {
        create: {
          age: 30,
          gender: 'OTHER',
          heightCm: 175,
          weightKg: 70,
          activityLevel: 'MODERATE',
          goal: 'LOSE_WEIGHT',
          dailyCalorieTarget: 2000,
          dailyWaterTarget: 8
        }
      }
    }
  });
  console.log('Seeded sample user.');

  // Add some meal logs for today
  await prisma.mealLog.createMany({
    data: [
      {
        userId: user.id,
        foodId: createdFoods[0].id,
        mealType: 'BREAKFAST',
        servingQuantity: 1,
      },
      {
        userId: user.id,
        foodId: createdFoods[1].id,
        mealType: 'BREAKFAST',
        servingQuantity: 2,
      },
      {
        userId: user.id,
        foodId: createdFoods[2].id,
        mealType: 'LUNCH',
        servingQuantity: 1,
      }
    ]
  });
  console.log('Seeded meal logs.');

  console.log('Seeding finished.');
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

