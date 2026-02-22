import React, { useState } from "react";

export const GoalForm = () => {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "male",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // The data you'll send to the Flask dev's endpoint
    console.log("Submitting to Flask:", formData);

    try {
      // Example of the fetch call to the Python backend
      // const response = await fetch('http://localhost:5000/api/profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      await new Promise((resolve) => setTimeout(resolve, 900));
      alert("Goals saved! Logic handed off to Flask.");
    } catch (err) {
      console.error("Connection to Flask failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Personal Metrics</h2>
        <p className="text-slate-500 text-sm">
          Provide your details to calculate your variety-safe meal plan.
        </p>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 h-14 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Generating...
            </>
          ) : (
            "Generate My Plan"
          )}
        </button>
      </form>
    </div>
  );
};
