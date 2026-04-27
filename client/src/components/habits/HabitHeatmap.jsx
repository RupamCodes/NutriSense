import React from 'react';
import { format, subDays, startOfDay } from 'date-fns';
export const HabitHeatmap = ({ completions }) => {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 84 }).map((_, i) => {
    const d = subDays(today, 83 - i);
    return {
      date: format(d, 'yyyy-MM-dd'),
      count: 0
    };
  });
  const completionCounts = completions.reduce((acc, dateStr) => {
    const d = format(startOfDay(new Date(dateStr)), 'yyyy-MM-dd');
    if (!acc[d]) acc[d] = 0;
    acc[d]++;
    return acc;
  }, {});
  const gridData = days.map(d => ({
    ...d,
    count: completionCounts[d.date] || 0
  }));
  const getColor = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count === 1) return 'bg-green-200 dark:bg-green-800/40';
    if (count === 2) return 'bg-green-400 dark:bg-green-600/60';
    return 'bg-green-600 dark:bg-green-500';
  };
  return (
    <div className="w-full overflow-x-auto py-2">
      <div 
        className="grid grid-flow-col gap-1 w-fit" 
        style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
      >
        {gridData.map((day, idx) => (
          <div
            key={idx}
            title={`${day.count} completions on ${day.date}`}
            className={`w-3 h-3 rounded-sm ${getColor(day.count)} transition-colors`}
          />
        ))}
      </div>
    </div>
  );
};
