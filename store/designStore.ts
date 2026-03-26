'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Preferences, Design, Message } from '@/types';

interface DesignStore {
  // Chat state
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;

  // Preferences
  preferences: Partial<Preferences>;
  updatePreferences: (prefs: Partial<Preferences>) => void;

  // Generated designs
  designs: Design[];
  addDesign: (design: Design) => void;
  removeDesign: (id: string) => void;
  selectedDesign: Design | null;
  selectDesign: (design: Design | null) => void;

  // Room image
  roomImage: string | null;
  setRoomImage: (image: string | null) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  messages: [],
  preferences: {},
  designs: [],
  selectedDesign: null,
  roomImage: null,
};

export const useDesignStore = create<DesignStore>()(
  persist(
    (set) => ({
      ...initialState,

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      clearMessages: () => set({ messages: [] }),

      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      addDesign: (design) =>
        set((state) => ({
          // Prevent duplicate IDs — upsert by replacing if already present
          designs: state.designs.some((d) => d.id === design.id)
            ? state.designs.map((d) => (d.id === design.id ? design : d))
            : [...state.designs, design],
        })),

      removeDesign: (id) =>
        set((state) => ({ designs: state.designs.filter((d) => d.id !== id) })),

      selectDesign: (design) => set({ selectedDesign: design }),

      setRoomImage: (image) => set({ roomImage: image }),

      reset: () => set(initialState),
    }),
    {
      name: 'design-storage',
      version: 2,
      // When version changes, reset to initial state (clears duplicate-ridden old data)
      migrate: () => Promise.resolve(initialState),
    }
  )
);
