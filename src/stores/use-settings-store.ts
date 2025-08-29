import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSettings } from "@/types";

interface SettingsStore {
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setApiKey: (provider: "anthropic" | "openai", key: string) => void;
  clearApiKeys: () => void;
  toggleTheme: () => void;
}

const defaultSettings: UserSettings = {
  theme: "system",
  codeTheme: "vs-dark",
  fontSize: "medium",
  apiKeys: {},
  notifications: {
    achievements: true,
    dailyReminder: false,
    weeklyProgress: true,
  },
  learning: {
    dailyGoal: 30, // 30 minutes
    preferredDifficulty: "intermediate",
    autoPlayVideos: false,
    showHints: true,
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      updateSettings: (newSettings: Partial<UserSettings>) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },

      setApiKey: (provider: "anthropic" | "openai", key: string) => {
        set((state) => ({
          settings: {
            ...state.settings,
            apiKeys: {
              ...state.settings.apiKeys,
              [provider]: key,
            },
          },
        }));
      },

      clearApiKeys: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            apiKeys: {},
          },
        }));
      },

      toggleTheme: () => {
        const { settings } = get();
        const themes: UserSettings["theme"][] = ["light", "dark", "system"];
        const currentIndex = themes.indexOf(settings.theme);
        const nextIndex = (currentIndex + 1) % themes.length;

        set((state) => ({
          settings: {
            ...state.settings,
            theme: themes[nextIndex],
          },
        }));
      },
    }),
    {
      name: "settings-store",
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);
