import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { GoalForm, type GoalProfile } from "./GoalForm";
import { MealDashboard, type DayPlan, type Food } from "./MealDashboard";
import { requestMealPlanFromBackend } from "./aiService";

const STORAGE_KEY = "food-chooser-dashboard-state";

const defaultGoalProfile: GoalProfile = {
  weight: "",
  height: "",
  age: "",
  gender: "male",
  calorieGoal: "",
};

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
  selectedWeek: DayPlan[];
  activeDayIndex: number;
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
    typeof food.cuisine === "string" &&
    typeof food.recipe === "object" &&
    food.recipe !== null &&
    Array.isArray(food.recipe.ingredients) &&
    food.recipe.ingredients.every((item) => typeof item === "string") &&
    Array.isArray(food.recipe.steps) &&
    food.recipe.steps.every((item) => typeof item === "string")
  );
};

const isValidDayPlan = (value: unknown): value is DayPlan => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const dayPlan = value as DayPlan;
  return (
    typeof dayPlan.day === "string" &&
    Array.isArray(dayPlan.meals) &&
    dayPlan.meals.length === 3 &&
    dayPlan.meals.every(isValidFood)
  );
};

const readPersistedState = (): PersistedAppState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedAppState>;
    const hasValidWeek =
      Array.isArray(parsed.selectedWeek) &&
      parsed.selectedWeek.length === 7 &&
      parsed.selectedWeek.every(isValidDayPlan);
    const hasValidView =
      parsed.currentView === "form" || parsed.currentView === "dashboard";
    const hasValidDayIndex =
      typeof parsed.activeDayIndex === "number" &&
      parsed.activeDayIndex >= 0 &&
      parsed.activeDayIndex < 7;

    if (
      typeof parsed.dailyGoal !== "number" ||
      !isValidGoalProfile(parsed.goalProfile) ||
      !hasValidWeek ||
      !hasValidView ||
      !hasValidDayIndex
    ) {
      return null;
    }

    const validatedWeek = parsed.selectedWeek as DayPlan[];
    const validatedActiveDayIndex = parsed.activeDayIndex as number;
    const validatedView = parsed.currentView as "form" | "dashboard";

    return {
      dailyGoal: parsed.dailyGoal,
      selectedWeek: validatedWeek,
      activeDayIndex: validatedActiveDayIndex,
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
  const [selectedWeek, setSelectedWeek] = useState<DayPlan[]>(
    initialState?.selectedWeek ?? [],
  );
  const [activeDayIndex, setActiveDayIndex] = useState(
    initialState?.activeDayIndex ?? 0,
  );
  const [goalProfile, setGoalProfile] = useState<GoalProfile>(
    initialState?.goalProfile ?? defaultGoalProfile,
  );
  const [currentView, setCurrentView] = useState<"form" | "dashboard">(
    initialState?.currentView ?? "form",
  );

  const activeDayMeals = selectedWeek[activeDayIndex]?.meals ?? [];

  const calorieTotal = useMemo(
    () => activeDayMeals.reduce((sum, meal) => sum + meal.calories, 0),
    [activeDayMeals],
  );

  const uniqueCuisineCount = useMemo(
    () => new Set(activeDayMeals.map((meal) => meal.cuisine)).size,
    [activeDayMeals],
  );

  const handleGeneratePlan = async (profile: GoalProfile) => {
    const manualGoal = Number(profile.calorieGoal);
    const generatedWeek = await requestMealPlanFromBackend(profile);

    setGoalProfile(profile);
    setDailyGoal(manualGoal > 0 ? manualGoal : calculateDailyGoal(profile));
    setSelectedWeek(generatedWeek);
    setActiveDayIndex(0);
    setCurrentView("dashboard");
  };

  const handleShuffleWeek = async () => {
    try {
      const generatedWeek = await requestMealPlanFromBackend(goalProfile);
      setSelectedWeek(generatedWeek);
    } catch (error) {
      console.error("Could not regenerate meal plan", error);
    }
  };

  const handleShuffleDay = async () => {
    try {
      const generatedWeek = await requestMealPlanFromBackend(goalProfile);
      setSelectedWeek((current) => {
        if (current.length !== 7 || generatedWeek.length !== 7) {
          return generatedWeek;
        }

        const updated = [...current];
        updated[activeDayIndex] = generatedWeek[activeDayIndex];
        return updated;
      });
    } catch (error) {
      console.error("Could not regenerate day", error);
    }
  };

  const handleSwapMeal = async (mealIndex: number) => {
    try {
      const generatedWeek = await requestMealPlanFromBackend(goalProfile);
      setSelectedWeek((current) => {
        if (current.length !== 7 || generatedWeek.length !== 7) {
          return generatedWeek;
        }

        const updated = [...current];
        const currentDay = updated[activeDayIndex];
        const generatedDay = generatedWeek[activeDayIndex];

        if (!currentDay || !generatedDay) {
          return generatedWeek;
        }

        const nextMeals = [...currentDay.meals];
        nextMeals[mealIndex] = generatedDay.meals[mealIndex];
        updated[activeDayIndex] = {
          ...currentDay,
          meals: nextMeals,
        };

        return updated;
      });
    } catch (error) {
      console.error("Could not swap meal", error);
    }
  };

  const handleResetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDailyGoal(2100);
    setSelectedWeek([]);
    setActiveDayIndex(0);
    setGoalProfile(defaultGoalProfile);
    setCurrentView("form");
  };

  useEffect(() => {
    const stateToPersist: PersistedAppState = {
      dailyGoal,
      selectedWeek,
      activeDayIndex,
      goalProfile,
      currentView,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
  }, [activeDayIndex, currentView, dailyGoal, goalProfile, selectedWeek]);

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
          selectedWeek={selectedWeek}
          activeDayIndex={activeDayIndex}
          dailyGoal={dailyGoal}
          calorieTotal={calorieTotal}
          cuisineVarietyScore={Math.round((uniqueCuisineCount / 3) * 100)}
          onSelectDay={setActiveDayIndex}
          onShuffleWeek={handleShuffleWeek}
          onShuffleDay={handleShuffleDay}
          onSwapMeal={handleSwapMeal}
          onEditGoals={() => setCurrentView("form")}
          onResetAllData={handleResetAllData}
        />
      )}
    </main>
  );
}

export default App;
