import React, { useEffect, useState } from "react";

export interface GoalProfile {
  weight: string;
  height: string;
  age: string;
  gender: "male" | "female" | "other";
  calorieGoal: string;
}

interface GoalFormProps {
  onGeneratePlan: (profile: GoalProfile) => Promise<void>;
  initialProfile: GoalProfile;
  isEditing?: boolean;
}

export const GoalForm = ({
  onGeneratePlan,
  initialProfile,
  isEditing = false,
}: GoalFormProps) => {
  const COOLDOWN_SECONDS = 10;
  const [formData, setFormData] = useState<GoalProfile>(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    setFormData(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldownSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || cooldownSeconds > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await onGeneratePlan(formData);
    } catch (err) {
      console.error("Could not generate meal plan", err);
      const message =
        err instanceof Error
          ? err.message
          : "Could not fetch meal plan from backend.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
      setCooldownSeconds(COOLDOWN_SECONDS);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Personal Metrics</h2>
        <p className="text-slate-500 text-sm">
          Provide your details to build your food dashboard and progress goals.
        </p>
        {submitError && (
          <p className="mt-2 text-sm font-medium text-rose-600">
            {submitError}
          </p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Weight */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="weight"
            className="text-sm font-semibold text-slate-700"
          >
            Weight (kg)
          </label>
          <input
            required
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="e.g. 75"
            className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="height"
            className="text-sm font-semibold text-slate-700"
          >
            Height (cm)
          </label>
          <input
            required
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="e.g. 180"
            className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="age" className="text-sm font-semibold text-slate-700">
            Age
          </label>
          <input
            required
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="e.g. 28"
            className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="gender"
            className="text-sm font-semibold text-slate-700"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={isSubmitting}
            className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="calorieGoal"
            className="text-sm font-semibold text-slate-700"
          >
            Calorie Goal (kcal)
          </label>
          <input
            required
            type="number"
            id="calorieGoal"
            name="calorieGoal"
            value={formData.calorieGoal}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="e.g. 2100"
            className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || cooldownSeconds > 0}
          className="mt-4 h-14 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Generating...
            </>
          ) : cooldownSeconds > 0 ? (
            `Please wait ${cooldownSeconds}s`
          ) : isEditing ? (
            "Save Goals & View Dashboard"
          ) : (
            "Build My Dashboard"
          )}
        </button>
      </form>
    </div>
  );
};
