import type { GoalProfile } from "./GoalForm";
import type { DayPlan, Food } from "./MealDashboard";

type MealPlanResponse = {
  week?: unknown;
};

const MEAL_PLAN_ENDPOINT = "/api/meal-plan";

const toFood = (item: unknown): Food | null => {
  if (typeof item !== "object" || item === null) {
    return null;
  }

  const value = item as Partial<Food>;

  if (
    typeof value.id !== "number" ||
    typeof value.name !== "string" ||
    typeof value.calories !== "number" ||
    typeof value.image_url !== "string" ||
    typeof value.cuisine !== "string" ||
    typeof value.recipe !== "object" ||
    value.recipe === null
  ) {
    return null;
  }

  const recipe = value.recipe as Partial<Food["recipe"]>;
  if (
    !Array.isArray(recipe.ingredients) ||
    !recipe.ingredients.every((entry) => typeof entry === "string") ||
    !Array.isArray(recipe.steps) ||
    !recipe.steps.every((entry) => typeof entry === "string")
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    calories: value.calories,
    image_url: value.image_url,
    cuisine: value.cuisine,
    recipe: {
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    },
  };
};

const toDayPlan = (item: unknown): DayPlan | null => {
  if (typeof item !== "object" || item === null) {
    return null;
  }

  const value = item as { day?: unknown; meals?: unknown };
  if (typeof value.day !== "string" || !Array.isArray(value.meals)) {
    return null;
  }

  const meals = value.meals
    .map(toFood)
    .filter((meal): meal is Food => meal !== null);
  if (meals.length !== 3) {
    return null;
  }

  return {
    day: value.day,
    meals,
  };
};

const normalizeWeek = (payload: MealPlanResponse): DayPlan[] => {
  if (!Array.isArray(payload.week)) {
    throw new Error("Backend response did not include a weekly plan.");
  }

  const week = payload.week
    .map(toDayPlan)
    .filter((day): day is DayPlan => day !== null);
  if (week.length !== 7) {
    throw new Error("Backend response did not include 7 valid days.");
  }

  return week;
};

export const requestMealPlanFromBackend = async (
  profile: GoalProfile,
): Promise<DayPlan[]> => {
  const response = await fetch(MEAL_PLAN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    let details = "";
    try {
      const errorPayload = (await response.json()) as { error?: string };
      details = errorPayload.error ? `: ${errorPayload.error}` : "";
    } catch {
      details = "";
    }
    throw new Error(`Backend returned HTTP ${response.status}${details}`);
  }

  const payload = (await response.json()) as MealPlanResponse;
  return normalizeWeek(payload);
};
