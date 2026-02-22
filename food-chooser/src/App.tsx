import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { GoalForm, type GoalProfile } from "./GoalForm";
import { MealDashboard, type Food } from "./MealDashboard";

const STORAGE_KEY = "food-chooser-dashboard-state";

const defaultGoalProfile: GoalProfile = {
  weight: "",
  height: "",
  age: "",
  gender: "male",
  calorieGoal: "",
};

const breakfastOptions: Food[] = [
  {
    id: 101,
    name: "Greek Yogurt Bowl",
    calories: 390,
    image_url:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Mediterranean",
  },
  {
    id: 102,
    name: "Avocado Egg Toast",
    calories: 420,
    image_url:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Western",
  },
  {
    id: 103,
    name: "Berry Oatmeal",
    calories: 360,
    image_url:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Nordic",
  },
];

const lunchOptions: Food[] = [
  {
    id: 201,
    name: "Chicken Burrito Bowl",
    calories: 640,
    image_url:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Mexican",
  },
  {
    id: 202,
    name: "Salmon Quinoa Plate",
    calories: 610,
    image_url:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Modern",
  },
  {
    id: 203,
    name: "Turkey Hummus Wrap",
    calories: 560,
    image_url:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Middle Eastern",
  },
];

const dinnerOptions: Food[] = [
  {
    id: 301,
    name: "Teriyaki Tofu Rice Bowl",
    calories: 670,
    image_url:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Japanese",
  },
  {
    id: 302,
    name: "Pesto Chicken Pasta",
    calories: 720,
    image_url:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Italian",
  },
  {
    id: 303,
    name: "Lentil Curry Plate",
    calories: 630,
    image_url:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Indian",
  },
];

const mealOptions = [breakfastOptions, lunchOptions, dinnerOptions];

const randomFrom = (options: Food[], excludeId?: number) => {
  const filtered =
    excludeId === undefined
      ? options
      : options.filter((item) => item.id !== excludeId);
  const source = filtered.length > 0 ? filtered : options;
  const index = Math.floor(Math.random() * source.length);
  return source[index];
};

const buildPlan = (current?: Food[]) =>
  mealOptions.map((options, index) =>
    randomFrom(options, current?.[index]?.id),
  );

const calculateDailyGoal = ({ weight, height, age, gender }: GoalProfile) => {
  const numericWeight = Number(weight);
  const numericHeight = Number(height);
  const numericAge = Number(age);

  const baseBmr =
    10 * numericWeight +
    6.25 * numericHeight -
    5 * numericAge +
    (gender === "male" ? 5 : gender === "female" ? -161 : -70);

  return Math.round(baseBmr * 1.2);
};

type PersistedAppState = {
  dailyGoal: number;
  selectedMeals: Food[];
  goalProfile: GoalProfile;
  currentView: "form" | "dashboard";
};

const isValidGoalProfile = (value: unknown): value is GoalProfile => {
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

const isValidFood = (value: unknown): value is Food => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const food = value as Food;
  return (
    typeof food.id === "number" &&
    typeof food.name === "string" &&
    typeof food.calories === "number" &&
    typeof food.image_url === "string" &&
    typeof food.cuisine === "string"
  );
};

const readPersistedState = (): PersistedAppState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedAppState>;
    const hasValidMeals =
      Array.isArray(parsed.selectedMeals) &&
      parsed.selectedMeals.length === 3 &&
      parsed.selectedMeals.every(isValidFood);
    const hasValidView =
      parsed.currentView === "form" || parsed.currentView === "dashboard";

    if (
      typeof parsed.dailyGoal !== "number" ||
      !isValidGoalProfile(parsed.goalProfile) ||
      !hasValidMeals ||
      !hasValidView
    ) {
      return null;
    }

    const validatedMeals = parsed.selectedMeals as Food[];
    const validatedView = parsed.currentView as "form" | "dashboard";

    return {
      dailyGoal: parsed.dailyGoal,
      selectedMeals: validatedMeals,
      goalProfile: parsed.goalProfile,
      currentView: validatedView,
    };
  } catch {
    return null;
  }
};

function App() {
  const [initialState] = useState<PersistedAppState | null>(() =>
    readPersistedState(),
  );
  const [dailyGoal, setDailyGoal] = useState(initialState?.dailyGoal ?? 2100);
  const [selectedMeals, setSelectedMeals] = useState<Food[]>(
    initialState?.selectedMeals ?? buildPlan(),
  );
  const [goalProfile, setGoalProfile] = useState<GoalProfile>(
    initialState?.goalProfile ?? defaultGoalProfile,
  );
  const [currentView, setCurrentView] = useState<"form" | "dashboard">(
    initialState?.currentView ?? "form",
  );

  const calorieTotal = useMemo(
    () => selectedMeals.reduce((sum, meal) => sum + meal.calories, 0),
    [selectedMeals],
  );

  const uniqueCuisineCount = useMemo(
    () => new Set(selectedMeals.map((meal) => meal.cuisine)).size,
    [selectedMeals],
  );

  const handleGeneratePlan = (profile: GoalProfile) => {
    const manualGoal = Number(profile.calorieGoal);
    setGoalProfile(profile);
    setDailyGoal(manualGoal > 0 ? manualGoal : calculateDailyGoal(profile));
    setSelectedMeals(buildPlan());
    setCurrentView("dashboard");
  };

  const handleShuffle = () => {
    setSelectedMeals((current) => buildPlan(current));
  };

  const handleSwapMeal = (mealIndex: number) => {
    setSelectedMeals((current) => {
      const updated = [...current];
      updated[mealIndex] = randomFrom(
        mealOptions[mealIndex],
        current[mealIndex].id,
      );
      return updated;
    });
  };

  const handleResetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDailyGoal(2100);
    setSelectedMeals(buildPlan());
    setGoalProfile(defaultGoalProfile);
    setCurrentView("form");
  };

  useEffect(() => {
    const stateToPersist: PersistedAppState = {
      dailyGoal,
      selectedMeals,
      goalProfile,
      currentView,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
  }, [currentView, dailyGoal, goalProfile, selectedMeals]);

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      {currentView === "form" ? (
        <GoalForm
          onGeneratePlan={handleGeneratePlan}
          initialProfile={goalProfile}
          isEditing={goalProfile.weight !== ""}
        />
      ) : (
        <MealDashboard
          selectedMeals={selectedMeals}
          dailyGoal={dailyGoal}
          calorieTotal={calorieTotal}
          cuisineVarietyScore={Math.round((uniqueCuisineCount / 3) * 100)}
          onShuffle={handleShuffle}
          onSwapMeal={handleSwapMeal}
          onEditGoals={() => setCurrentView("form")}
          onResetAllData={handleResetAllData}
        />
      )}
    </main>
  );
}

export default App;
