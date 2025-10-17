import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      days: [{ id: 1, label: "Day 1", sales: {} }],
      activeDay: 1,
      filterItem: null,
      chartData: [],
      summary: [],

      setActiveDay: (id) => set({ activeDay: id }),
      setFilterItem: (item) => set({ filterItem: item }),
      setChartData: (data) => set({ chartData: data }),
      setSummary: (data) => set({ summary: data }),
      clearAll: () =>
        set({
          days: [{ id: 1, label: "Day 1", sales: {} }],
          chartData: [],
          summary: [],
        }),

      // --- ADD THESE TWO LOGICS BELOW ---
      addDay: () => {
        const { days } = get();
        if (days.length >= 30) return;
        const newId = days.length + 1;
        set({
          days: [...days, { id: newId, label: `Day ${newId}`, sales: {} }],
        });
      },

      modifySales: (itemId, delta) => {
        const { days, activeDay } = get();
        const updated = days.map((d) =>
          d.id === activeDay
            ? {
                ...d,
                sales: {
                  ...d.sales,
                  [itemId]: Math.max(0, (d.sales[itemId] || 0) + delta),
                },
              }
            : d
        );
        set({ days: updated });
      },
    }),

    {
      name: "analytics-storage",
      getStorage: () =>
        typeof window !== "undefined" ? localStorage : undefined,
    }
  )
);
