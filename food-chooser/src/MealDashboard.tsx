// Define what a Food item looks like
export interface Food {
  id: number;
  name: string;
  calories: number;
  image_url: string;
  cuisine: string;
  recipe: {
    ingredients: string[];
    steps: string[];
  };
}

export interface DayPlan {
  day: string;
  meals: Food[];
}

interface DashboardProps {
  selectedWeek: DayPlan[];
  activeDayIndex: number;
  dailyGoal: number;
  calorieTotal: number;
  cuisineVarietyScore: number;
  onSelectDay: (dayIndex: number) => void;
  onShuffleWeek: () => void;
  onShuffleDay: () => void;
  onSwapMeal: (mealIndex: number) => void;
  onEditGoals: () => void;
  onResetAllData: () => void;
}

export const MealDashboard = ({
  selectedWeek,
  activeDayIndex,
  dailyGoal,
  calorieTotal,
  cuisineVarietyScore,
  onSelectDay,
  onShuffleWeek,
  onShuffleDay,
  onSwapMeal,
  onEditGoals,
  onResetAllData,
}: DashboardProps) => {
  const activeDay = selectedWeek[activeDayIndex];
  const calorieProgress = Math.min(
    Math.round((calorieTotal / dailyGoal) * 100),
    100,
  );

  if (!activeDay) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header with Progress Bar */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Your Food Choice Dashboard
        </h2>
        <div className="mb-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onEditGoals}
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Edit Goals
          </button>
          <button
            type="button"
            onClick={onResetAllData}
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
          >
            Reset All Data
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-6 text-left">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">
              Calorie Goal Progress
            </p>
            <div className="flex items-end justify-between gap-2">
              <p className="text-lg font-bold text-slate-900">
                {calorieTotal} / {dailyGoal} kcal
              </p>
              <span className="text-sm font-semibold text-indigo-600">
                {calorieProgress}%
              </span>
            </div>
            <div className="h-3 mt-3 rounded-full overflow-hidden bg-slate-200">
              <div
                className="h-full bg-indigo-500 transition-all"
                style={{ width: `${calorieProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">
              Variety Goal Progress
            </p>
            <div className="flex items-end justify-between gap-2">
              <p className="text-lg font-bold text-slate-900">
                Cuisine variety
              </p>
              <span className="text-sm font-semibold text-indigo-600">
                {cuisineVarietyScore}%
              </span>
            </div>
            <div className="h-3 mt-3 rounded-full overflow-hidden bg-slate-200">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${cuisineVarietyScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3 text-center">
          Weekly Plan
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {selectedWeek.map((dayPlan, dayIndex) => (
            <button
              key={dayPlan.day}
              type="button"
              onClick={() => onSelectDay(dayIndex)}
              className={`px-3 py-2 text-sm font-semibold rounded-xl transition-colors ${
                dayIndex === activeDayIndex
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {dayPlan.day}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-slate-900">{activeDay.day}</h3>
        <p className="text-sm text-slate-500">Meals and recipes for this day</p>
      </div>

      {/* The 3-Meal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {activeDay.meals.map((food, index) => (
          <div
            key={food.id}
            className="group relative bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform"
          >
            <div className="relative h-56 w-full mb-6 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={food.image_url}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                alt={food.name}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                {index === 0 ? "Breakfast" : index === 1 ? "Lunch" : "Dinner"}
              </div>
            </div>

            <div className="px-2">
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">
                {food.name}
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                {food.cuisine} Style
              </p>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-indigo-600">
                  {food.calories}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    kcal
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onSwapMeal(index)}
                  className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Change Food
                </button>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">
                  Ingredients
                </p>
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                  {food.recipe.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                  ))}
                </ul>

                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mt-4 mb-2">
                  Steps
                </p>
                <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1">
                  {food.recipe.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* The "Anti-Mundane" Shuffle Button */}
      <div className="mt-16 flex flex-wrap justify-center gap-3">
        <button
          onClick={onShuffleDay}
          className="group flex items-center gap-3 bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200"
        >
          <span className="group-hover:rotate-180 transition-transform duration-500">
            📅
          </span>
          Regenerate This Day
        </button>
        <button
          onClick={onShuffleWeek}
          className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-200"
        >
          <span className="group-hover:rotate-180 transition-transform duration-500">
            🔄
          </span>
          I'm Bored, Regenerate Week
        </button>
      </div>
    </div>
  );
};
