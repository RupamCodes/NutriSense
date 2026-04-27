import React from 'react';
const RDA = {
  protein_g: 50,
  fiber_g: 28,
  iron_mg: 18,
  calcium_mg: 1000,
  vitamin_c_mg: 90,
  vitamin_d_mcg: 20
};
export const NutrientGapAlert = ({ nutrient, averageValue }) => {
  const rda = RDA[nutrient];
  if (!rda) return null;
  const percentage = (averageValue / rda) * 100;
  if (percentage >= 75) return null;
  let severity = 'warning';
  if (percentage < 50) severity = 'critical';
  const baseClasses = "flex items-start p-4 rounded-lg border my-2";
  const severityClasses = severity === 'critical'
    ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
    : "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300";
  return (
    <div className={`${baseClasses} ${severityClasses}`}>
      <span className="material-symbols-outlined mr-3 mt-0.5">
        {severity === 'critical' ? 'error' : 'warning'}
      </span>
      <div>
        <h4 className="font-semibold capitalize">{nutrient.replace('_', ' ')} Gap</h4>
        <p className="text-sm mt-1">
          Your average intake ({averageValue.toFixed(1)}) is {percentage.toFixed(0)}% of the daily recommendation ({rda}).
        </p>
      </div>
    </div>
  );
};
