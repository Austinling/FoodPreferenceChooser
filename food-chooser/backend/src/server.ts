import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
dotenv.config({ path: path.resolve(currentDirPath, "../.env") });

type GoalProfile = {
  weight: string;
  height: string;
  age: string;
  gender: "male" | "female" | "other";
  calorieGoal: string;
};

type Recipe = {
  ingredients: string[];
  steps: string[];
};

type DayPlan = {
  day: string;
  meals: Food[];
};

type Food = {
  id: number;
  name: string;
  calories: number;
  image_url: string;
  cuisine: string;
  recipe: Recipe;
};

type CatalogFood = Omit<Food, "recipe">;

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

const isValidProfile = (value: unknown): value is GoalProfile => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const profile = value as GoalProfile;
  return (
    typeof profile.weight === "string" &&
    typeof profile.height === "string" &&
    typeof profile.age === "string" &&
    typeof profile.calorieGoal === "string" &&
    ["male", "female", "other"].includes(profile.gender)
  );
};

const breakfastCatalog: CatalogFood[] = [
  {
    id: 1001,
    name: "Greek Yogurt Berry Bowl",
    calories: 390,
    image_url:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Mediterranean",
  },
  {
    id: 1002,
    name: "Avocado Egg Toast",
    calories: 420,
    image_url:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Western",
  },
  {
    id: 1003,
    name: "Berry Oatmeal",
    calories: 360,
    image_url:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Nordic",
  },
  {
    id: 1004,
    name: "Spinach Mushroom Omelet",
    calories: 410,
    image_url:
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=1200&q=80",
    cuisine: "French",
  },
  {
    id: 1005,
    name: "Cottage Cheese Fruit Plate",
    calories: 340,
    image_url:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Modern",
  },
  {
    id: 1006,
    name: "Protein Pancakes",
    calories: 470,
    image_url:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80",
    cuisine: "American",
  },
  {
    id: 1007,
    name: "Smoked Salmon Bagel",
    calories: 510,
    image_url:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
    cuisine: "European",
  },
  {
    id: 1008,
    name: "Chia Pudding",
    calories: 330,
    image_url:
      "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Modern",
  },
  {
    id: 1009,
    name: "Shakshuka",
    calories: 450,
    image_url:
      "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Middle Eastern",
  },
  {
    id: 1010,
    name: "Tofu Scramble Wrap",
    calories: 430,
    image_url:
      "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Vegan",
  },
  {
    id: 1011,
    name: "Banana Peanut Toast",
    calories: 440,
    image_url:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
    cuisine: "American",
  },
  {
    id: 1012,
    name: "Egg Fried Rice Breakfast",
    calories: 520,
    image_url:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Asian",
  },
];

const lunchCatalog: CatalogFood[] = [
  {
    id: 2001,
    name: "Chicken Burrito Bowl",
    calories: 640,
    image_url:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Mexican",
  },
  {
    id: 2002,
    name: "Salmon Quinoa Plate",
    calories: 610,
    image_url:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Modern",
  },
  {
    id: 2003,
    name: "Turkey Hummus Wrap",
    calories: 560,
    image_url:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Middle Eastern",
  },
  {
    id: 2004,
    name: "Chicken Caesar Salad",
    calories: 540,
    image_url:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Italian",
  },
  {
    id: 2005,
    name: "Tuna Poke Bowl",
    calories: 590,
    image_url:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Hawaiian",
  },
  {
    id: 2006,
    name: "Paneer Tikka Bowl",
    calories: 620,
    image_url:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Indian",
  },
  {
    id: 2007,
    name: "Shrimp Noodle Salad",
    calories: 570,
    image_url:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Thai",
  },
  {
    id: 2008,
    name: "Falafel Grain Bowl",
    calories: 600,
    image_url:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Mediterranean",
  },
  {
    id: 2009,
    name: "Beef Bibimbap",
    calories: 690,
    image_url:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Korean",
  },
  {
    id: 2010,
    name: "Soba Tofu Bowl",
    calories: 580,
    image_url:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Japanese",
  },
  {
    id: 2011,
    name: "Roast Chicken Sandwich",
    calories: 550,
    image_url:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Western",
  },
  {
    id: 2012,
    name: "Lentil Veg Stew",
    calories: 520,
    image_url:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Vegan",
  },
];

const dinnerCatalog: CatalogFood[] = [
  {
    id: 3001,
    name: "Teriyaki Tofu Rice Bowl",
    calories: 670,
    image_url:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Japanese",
  },
  {
    id: 3002,
    name: "Pesto Chicken Pasta",
    calories: 720,
    image_url:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Italian",
  },
  {
    id: 3003,
    name: "Lentil Curry Plate",
    calories: 630,
    image_url:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Indian",
  },
  {
    id: 3004,
    name: "Grilled Salmon Vegetables",
    calories: 690,
    image_url:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Modern",
  },
  {
    id: 3005,
    name: "Steak Sweet Potato",
    calories: 760,
    image_url:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80",
    cuisine: "American",
  },
  {
    id: 3006,
    name: "Chicken Stir Fry",
    calories: 650,
    image_url:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Asian",
  },
  {
    id: 3007,
    name: "Miso Cod Bowl",
    calories: 700,
    image_url:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Japanese",
  },
  {
    id: 3008,
    name: "Turkey Meatball Pasta",
    calories: 710,
    image_url:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Italian",
  },
  {
    id: 3009,
    name: "Chickpea Tagine",
    calories: 620,
    image_url:
      "https://images.unsplash.com/photo-1559847844-d721426d6edc?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Moroccan",
  },
  {
    id: 3010,
    name: "Sushi Rice Salmon Bowl",
    calories: 680,
    image_url:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Japanese",
  },
  {
    id: 3011,
    name: "Veggie Lasagna",
    calories: 640,
    image_url:
      "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Italian",
  },
  {
    id: 3012,
    name: "Grilled Chicken Couscous",
    calories: 660,
    image_url:
      "https://images.unsplash.com/photo-1543332164-6e82f355bad5?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Mediterranean",
  },
];

const randomFrom = (options: CatalogFood[]): CatalogFood => {
  const index = Math.floor(Math.random() * options.length);
  return options[index];
};

const pickClosestToTarget = (
  options: CatalogFood[],
  targetCalories: number,
): CatalogFood => {
  const sorted = [...options].sort(
    (a, b) =>
      Math.abs(a.calories - targetCalories) -
      Math.abs(b.calories - targetCalories),
  );

  const topCandidates = sorted.slice(0, Math.min(5, sorted.length));
  return randomFrom(topCandidates);
};

const buildRecipeForMeal = (meal: CatalogFood): Recipe => {
  const recipesByName: Record<string, Recipe> = {
    "Greek Yogurt Berry Bowl": {
      ingredients: [
        "1 cup Greek yogurt",
        "1/2 cup mixed berries",
        "2 tbsp granola",
        "1 tbsp honey",
        "1 tsp chia seeds",
      ],
      steps: [
        "Spoon Greek yogurt into a bowl.",
        "Top with berries and granola.",
        "Drizzle honey over the bowl.",
        "Finish with chia seeds and serve.",
      ],
    },
    "Avocado Egg Toast": {
      ingredients: [
        "2 slices whole grain bread",
        "1 ripe avocado",
        "2 eggs",
        "1 tsp lemon juice",
        "Salt, pepper, chili flakes",
      ],
      steps: [
        "Toast the bread until crisp.",
        "Mash avocado with lemon juice, salt, and pepper.",
        "Cook eggs to your preference.",
        "Spread avocado on toast, top with eggs, and add chili flakes.",
      ],
    },
    "Berry Oatmeal": {
      ingredients: [
        "1/2 cup rolled oats",
        "1 cup milk or water",
        "1/2 cup berries",
        "1 tsp maple syrup",
        "Pinch of cinnamon",
      ],
      steps: [
        "Simmer oats with milk or water for 5-7 minutes.",
        "Stir in cinnamon and maple syrup.",
        "Transfer to a bowl.",
        "Top with berries and serve warm.",
      ],
    },
    "Spinach Mushroom Omelet": {
      ingredients: [
        "3 eggs",
        "1 cup spinach",
        "1/2 cup sliced mushrooms",
        "1 tsp olive oil",
        "Salt and pepper",
      ],
      steps: [
        "Sauté mushrooms in olive oil for 2-3 minutes.",
        "Add spinach and cook until wilted.",
        "Pour beaten eggs into pan and season.",
        "Fold omelet once set and cook through.",
      ],
    },
    "Cottage Cheese Fruit Plate": {
      ingredients: [
        "1 cup cottage cheese",
        "1/2 cup pineapple chunks",
        "1/2 cup sliced peaches",
        "1 tbsp walnuts",
        "1 tsp honey",
      ],
      steps: [
        "Arrange cottage cheese on a plate.",
        "Add pineapple and peach slices around it.",
        "Top with walnuts.",
        "Drizzle honey and serve chilled.",
      ],
    },
    "Protein Pancakes": {
      ingredients: [
        "1 scoop protein powder",
        "1/2 cup oats",
        "1 banana",
        "2 eggs",
        "1/4 cup milk",
      ],
      steps: [
        "Blend all ingredients into a smooth batter.",
        "Heat a nonstick pan over medium heat.",
        "Pour small rounds of batter and cook 2 minutes per side.",
        "Stack pancakes and serve with fruit.",
      ],
    },
    "Smoked Salmon Bagel": {
      ingredients: [
        "1 whole-grain bagel",
        "60 g smoked salmon",
        "2 tbsp cream cheese",
        "Cucumber slices",
        "Red onion slices",
      ],
      steps: [
        "Toast and split the bagel.",
        "Spread cream cheese on both halves.",
        "Layer smoked salmon, cucumber, and onion.",
        "Close or serve open-faced.",
      ],
    },
    "Chia Pudding": {
      ingredients: [
        "3 tbsp chia seeds",
        "3/4 cup milk",
        "1 tsp vanilla extract",
        "1 tsp maple syrup",
        "Fresh fruit topping",
      ],
      steps: [
        "Whisk chia seeds, milk, vanilla, and syrup.",
        "Refrigerate at least 4 hours or overnight.",
        "Stir once before serving.",
        "Top with fresh fruit.",
      ],
    },
    Shakshuka: {
      ingredients: [
        "2 eggs",
        "1 cup crushed tomatoes",
        "1/4 cup onion, diced",
        "1/2 tsp paprika",
        "1 tsp olive oil",
      ],
      steps: [
        "Sauté onion in olive oil.",
        "Add tomatoes and paprika; simmer 5 minutes.",
        "Make wells and crack eggs into sauce.",
        "Cover and cook until eggs set.",
      ],
    },
    "Tofu Scramble Wrap": {
      ingredients: [
        "150 g firm tofu",
        "1 tortilla wrap",
        "1/4 cup bell pepper",
        "1/4 tsp turmeric",
        "1 tbsp salsa",
      ],
      steps: [
        "Crumble tofu and cook with turmeric in a pan.",
        "Add bell pepper and cook 2-3 minutes.",
        "Warm the tortilla.",
        "Fill with tofu scramble and salsa, then wrap.",
      ],
    },
    "Banana Peanut Toast": {
      ingredients: [
        "2 slices whole grain bread",
        "1 tbsp peanut butter",
        "1 banana, sliced",
        "Pinch cinnamon",
        "1 tsp chia seeds",
      ],
      steps: [
        "Toast bread slices.",
        "Spread peanut butter evenly.",
        "Top with banana slices.",
        "Sprinkle cinnamon and chia seeds.",
      ],
    },
    "Egg Fried Rice Breakfast": {
      ingredients: [
        "1 cup cooked rice",
        "2 eggs",
        "1/4 cup peas and carrots",
        "1 tsp soy sauce",
        "1 tsp sesame oil",
      ],
      steps: [
        "Scramble eggs in a hot pan and set aside.",
        "Stir-fry vegetables for 2 minutes.",
        "Add rice, soy sauce, and sesame oil.",
        "Mix in eggs and cook until heated through.",
      ],
    },
    "Chicken Burrito Bowl": {
      ingredients: [
        "120 g chicken breast",
        "1 cup cooked rice",
        "1/2 cup black beans",
        "1/4 cup corn salsa",
        "1 tbsp lime juice",
      ],
      steps: [
        "Season and grill chicken, then slice.",
        "Warm rice and black beans.",
        "Assemble bowl with rice, beans, chicken, and corn salsa.",
        "Finish with lime juice.",
      ],
    },
    "Salmon Quinoa Plate": {
      ingredients: [
        "120 g salmon fillet",
        "3/4 cup cooked quinoa",
        "1 cup broccoli",
        "1 tsp olive oil",
        "Salt, pepper, lemon",
      ],
      steps: [
        "Season salmon and bake at 200°C for 12-15 minutes.",
        "Cook quinoa according to package instructions.",
        "Steam or sauté broccoli.",
        "Plate quinoa, broccoli, and salmon with lemon.",
      ],
    },
    "Turkey Hummus Wrap": {
      ingredients: [
        "1 whole wheat wrap",
        "90 g sliced turkey",
        "2 tbsp hummus",
        "Lettuce and tomato slices",
        "1 tbsp cucumber, diced",
      ],
      steps: [
        "Spread hummus over the wrap.",
        "Layer turkey, lettuce, tomato, and cucumber.",
        "Roll tightly, tucking in the sides.",
        "Slice in half and serve.",
      ],
    },
    "Chicken Caesar Salad": {
      ingredients: [
        "120 g grilled chicken",
        "2 cups romaine lettuce",
        "2 tbsp Caesar dressing",
        "1 tbsp parmesan",
        "1/4 cup croutons",
      ],
      steps: [
        "Slice grilled chicken.",
        "Toss lettuce with dressing.",
        "Top with chicken, parmesan, and croutons.",
        "Serve immediately.",
      ],
    },
    "Tuna Poke Bowl": {
      ingredients: [
        "120 g sushi-grade tuna",
        "1 cup cooked rice",
        "1/4 avocado, sliced",
        "1/4 cup cucumber",
        "1 tbsp soy-sesame sauce",
      ],
      steps: [
        "Cube tuna and toss with half the sauce.",
        "Add rice to a bowl.",
        "Top with tuna, avocado, and cucumber.",
        "Drizzle remaining sauce before serving.",
      ],
    },
    "Paneer Tikka Bowl": {
      ingredients: [
        "120 g paneer cubes",
        "1/2 cup yogurt",
        "1/2 tsp tikka masala spice",
        "1 cup cooked rice",
        "1/2 cup peppers and onions",
      ],
      steps: [
        "Marinate paneer in yogurt and spice for 15 minutes.",
        "Sear paneer until lightly charred.",
        "Sauté peppers and onions.",
        "Serve over rice with vegetables.",
      ],
    },
    "Shrimp Noodle Salad": {
      ingredients: [
        "120 g shrimp",
        "80 g rice noodles",
        "1 cup shredded cabbage",
        "1 tbsp lime juice",
        "1 tsp fish sauce",
      ],
      steps: [
        "Cook noodles and rinse under cold water.",
        "Sauté shrimp until pink.",
        "Combine noodles, shrimp, and cabbage.",
        "Toss with lime juice and fish sauce.",
      ],
    },
    "Falafel Grain Bowl": {
      ingredients: [
        "4 falafel balls",
        "3/4 cup cooked couscous",
        "1/2 cup cucumber and tomato salad",
        "2 tbsp tahini sauce",
        "Handful of spinach",
      ],
      steps: [
        "Bake or air-fry falafel until crisp.",
        "Prepare couscous and place in a bowl.",
        "Add spinach and cucumber-tomato salad.",
        "Top with falafel and drizzle tahini.",
      ],
    },
    "Beef Bibimbap": {
      ingredients: [
        "120 g lean beef strips",
        "1 cup cooked rice",
        "1/2 cup mixed veggies",
        "1 fried egg",
        "1 tbsp gochujang sauce",
      ],
      steps: [
        "Marinate and stir-fry beef.",
        "Sauté vegetables separately.",
        "Add rice to bowl and arrange beef and vegetables.",
        "Top with egg and gochujang sauce.",
      ],
    },
    "Soba Tofu Bowl": {
      ingredients: [
        "100 g soba noodles",
        "120 g firm tofu",
        "1 cup bok choy",
        "1 tsp sesame oil",
        "1 tbsp soy-ginger sauce",
      ],
      steps: [
        "Cook soba noodles and drain.",
        "Pan-sear tofu cubes until golden.",
        "Sauté bok choy in sesame oil.",
        "Combine noodles, tofu, and greens with sauce.",
      ],
    },
    "Roast Chicken Sandwich": {
      ingredients: [
        "2 slices whole grain bread",
        "100 g roast chicken",
        "Lettuce and tomato",
        "1 tsp mustard",
        "1 tsp mayo",
      ],
      steps: [
        "Toast bread if desired.",
        "Spread mustard and mayo on bread.",
        "Layer chicken, lettuce, and tomato.",
        "Close sandwich and slice.",
      ],
    },
    "Lentil Veg Stew": {
      ingredients: [
        "3/4 cup cooked lentils",
        "1 cup mixed vegetables",
        "1 cup vegetable broth",
        "1/2 tsp cumin",
        "1 tsp olive oil",
      ],
      steps: [
        "Sauté vegetables in olive oil.",
        "Add lentils, broth, and cumin.",
        "Simmer for 10-12 minutes.",
        "Serve hot.",
      ],
    },
    "Teriyaki Tofu Rice Bowl": {
      ingredients: [
        "150 g tofu cubes",
        "1 cup cooked rice",
        "1 cup broccoli",
        "2 tbsp teriyaki sauce",
        "1 tsp sesame seeds",
      ],
      steps: [
        "Pan-sear tofu until browned.",
        "Add teriyaki sauce and coat tofu.",
        "Steam broccoli and warm rice.",
        "Assemble bowl and garnish with sesame seeds.",
      ],
    },
    "Pesto Chicken Pasta": {
      ingredients: [
        "90 g pasta",
        "120 g chicken breast",
        "2 tbsp pesto",
        "1/2 cup cherry tomatoes",
        "1 tbsp parmesan",
      ],
      steps: [
        "Cook pasta and reserve a little pasta water.",
        "Sauté seasoned chicken until cooked, then slice.",
        "Toss pasta with pesto and a splash of pasta water.",
        "Top with chicken, tomatoes, and parmesan.",
      ],
    },
    "Lentil Curry Plate": {
      ingredients: [
        "1 cup cooked lentils",
        "1/2 cup coconut milk",
        "1 tsp curry powder",
        "1/4 cup onion, diced",
        "1 cup cooked rice",
      ],
      steps: [
        "Sauté onion until soft.",
        "Add lentils, curry powder, and coconut milk.",
        "Simmer for 8-10 minutes.",
        "Serve with rice.",
      ],
    },
    "Grilled Salmon Vegetables": {
      ingredients: [
        "140 g salmon",
        "1 cup zucchini and peppers",
        "1 tsp olive oil",
        "1 tsp lemon juice",
        "Salt and pepper",
      ],
      steps: [
        "Season salmon with salt and pepper.",
        "Grill salmon 4-5 minutes per side.",
        "Sauté vegetables in olive oil.",
        "Serve salmon over vegetables with lemon juice.",
      ],
    },
    "Steak Sweet Potato": {
      ingredients: [
        "140 g lean steak",
        "1 medium sweet potato",
        "1 tsp olive oil",
        "1 cup green beans",
        "Salt and pepper",
      ],
      steps: [
        "Bake sweet potato until tender.",
        "Season steak and sear to preferred doneness.",
        "Steam or sauté green beans.",
        "Plate steak with sweet potato and beans.",
      ],
    },
    "Chicken Stir Fry": {
      ingredients: [
        "120 g chicken breast",
        "1 cup mixed stir-fry vegetables",
        "1 tsp sesame oil",
        "1 tbsp soy sauce",
        "1 cup cooked rice",
      ],
      steps: [
        "Slice and cook chicken in sesame oil.",
        "Add vegetables and stir-fry 4-5 minutes.",
        "Add soy sauce and toss.",
        "Serve over rice.",
      ],
    },
    "Miso Cod Bowl": {
      ingredients: [
        "130 g cod fillet",
        "1 tbsp miso paste",
        "1 tsp honey",
        "1 cup cooked rice",
        "1/2 cup edamame",
      ],
      steps: [
        "Mix miso paste and honey, then coat cod.",
        "Bake cod at 200°C for 10-12 minutes.",
        "Warm rice and edamame.",
        "Serve cod over rice with edamame.",
      ],
    },
    "Turkey Meatball Pasta": {
      ingredients: [
        "120 g ground turkey",
        "90 g pasta",
        "1/2 cup tomato sauce",
        "1 tbsp breadcrumbs",
        "1 tbsp parmesan",
      ],
      steps: [
        "Mix turkey and breadcrumbs; form meatballs.",
        "Bake or pan-cook meatballs until done.",
        "Cook pasta and heat tomato sauce.",
        "Combine pasta, meatballs, and sauce; top parmesan.",
      ],
    },
    "Chickpea Tagine": {
      ingredients: [
        "1 cup chickpeas",
        "1/2 cup crushed tomatoes",
        "1/2 tsp cumin",
        "1/2 tsp cinnamon",
        "3/4 cup couscous",
      ],
      steps: [
        "Sauté spices briefly in a pot.",
        "Add chickpeas and tomatoes, then simmer 10 minutes.",
        "Prepare couscous separately.",
        "Serve tagine over couscous.",
      ],
    },
    "Sushi Rice Salmon Bowl": {
      ingredients: [
        "120 g salmon",
        "1 cup sushi rice",
        "1/4 cucumber, sliced",
        "1/4 avocado, sliced",
        "1 tbsp soy-sesame dressing",
      ],
      steps: [
        "Cook sushi rice and let it cool slightly.",
        "Bake or pan-sear salmon and flake it.",
        "Add rice to bowl and top with salmon and vegetables.",
        "Drizzle dressing and serve.",
      ],
    },
    "Veggie Lasagna": {
      ingredients: [
        "2 lasagna sheets",
        "1/2 cup ricotta",
        "1/2 cup spinach",
        "1/2 cup tomato sauce",
        "1/4 cup mozzarella",
      ],
      steps: [
        "Layer sauce, lasagna sheets, ricotta, and spinach.",
        "Repeat layers and top with mozzarella.",
        "Bake at 190°C for 30-35 minutes.",
        "Rest for 5 minutes before serving.",
      ],
    },
    "Grilled Chicken Couscous": {
      ingredients: [
        "120 g chicken breast",
        "3/4 cup cooked couscous",
        "1/2 cup cucumber and tomato",
        "1 tsp olive oil",
        "1 tsp lemon juice",
      ],
      steps: [
        "Grill seasoned chicken and slice.",
        "Cook couscous and fluff with fork.",
        "Toss cucumber and tomato with olive oil and lemon.",
        "Serve chicken over couscous with salad.",
      ],
    },
  };

  const specificRecipe = recipesByName[meal.name];
  if (specificRecipe) {
    return specificRecipe;
  }

  return {
    ingredients: [
      "1 serving protein of choice",
      "1 cup vegetables",
      "1 cup base carb",
      "1 tbsp olive oil",
      "Salt and pepper",
    ],
    steps: [
      `Prepare ingredients for ${meal.name}.`,
      "Cook protein and vegetables.",
      "Assemble with your carb base.",
      "Season and serve warm.",
    ],
  };
};

const buildMealPlanFromCatalog = (profile: GoalProfile): Food[] => {
  const dailyGoal =
    Number(profile.calorieGoal) > 0 ? Number(profile.calorieGoal) : 2100;

  const breakfastTarget = Math.round(dailyGoal * 0.28);
  const lunchTarget = Math.round(dailyGoal * 0.34);
  const dinnerTarget = Math.round(dailyGoal * 0.38);

  const selectedMeals = [
    pickClosestToTarget(breakfastCatalog, breakfastTarget),
    pickClosestToTarget(lunchCatalog, lunchTarget),
    pickClosestToTarget(dinnerCatalog, dinnerTarget),
  ];

  return selectedMeals.map((meal) => ({
    ...meal,
    recipe: buildRecipeForMeal(meal),
  }));
};

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const buildWeekPlanFromCatalog = (profile: GoalProfile): DayPlan[] => {
  const baseGoal =
    Number(profile.calorieGoal) > 0 ? Number(profile.calorieGoal) : 2100;

  return dayNames.map((dayName, dayIndex) => {
    const weekdayAdjustment = dayIndex >= 5 ? 120 : 0;
    const dayProfile: GoalProfile = {
      ...profile,
      calorieGoal: String(baseGoal + weekdayAdjustment),
    };

    return {
      day: dayName,
      meals: buildMealPlanFromCatalog(dayProfile),
    };
  });
};

app.post("/api/meal-plan", async (req, res) => {
  if (!isValidProfile(req.body)) {
    return res.status(400).json({ error: "Invalid profile payload." });
  }

  const week = buildWeekPlanFromCatalog(req.body);
  return res.json({ week });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
