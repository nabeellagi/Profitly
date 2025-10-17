"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useItemStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set({ items: [...get().items, item] }),
      updateItem: (id, updated) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, ...updated } : i)),
        }),
      deleteItem: (id) =>
        set({
          items: get().items.filter((i) => i.id !== id),
        }),
      clearAll: () => set({ items: [] }),
    }),
    {
      name: "profitly-items",
      getStorage: () =>
        typeof window !== "undefined" ? localStorage : undefined,
    }
  )
);
