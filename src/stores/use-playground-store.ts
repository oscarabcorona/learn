import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlaygroundSession, ModelParameters } from "@/types";
import { playgroundService } from "@/lib/services";

interface PlaygroundStore {
  // State
  sessions: PlaygroundSession[];
  currentSession: PlaygroundSession | null;
  isLoading: boolean;
  error: string | null;

  // Default parameters
  defaultParameters: ModelParameters;

  // Actions
  loadSessions: () => void;
  createSession: (
    prompt: string,
    systemPrompt: string,
    parameters?: ModelParameters,
  ) => Promise<void>;
  clearHistory: () => void;
  setCurrentSession: (session: PlaygroundSession | null) => void;
  updateParameters: (parameters: Partial<ModelParameters>) => void;
  exportSessions: () => string;
  importSessions: (sessionsJson: string) => void;
}

const defaultParameters: ModelParameters = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.95,
};

export const usePlaygroundStore = create<PlaygroundStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      isLoading: false,
      error: null,
      defaultParameters,

      loadSessions: () => {
        const sessions = playgroundService.getSessionHistory();
        set({ sessions });
      },

      createSession: async (
        prompt: string,
        systemPrompt: string,
        parameters?: ModelParameters,
      ) => {
        set({ isLoading: true, error: null });

        try {
          const params = parameters || get().defaultParameters;
          const session = await playgroundService.createSession(
            prompt,
            systemPrompt,
            params,
          );

          const sessions = playgroundService.getSessionHistory();
          set({
            sessions,
            currentSession: session,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "An error occurred",
            isLoading: false,
          });
        }
      },

      clearHistory: () => {
        playgroundService.clearHistory();
        set({ sessions: [], currentSession: null });
      },

      setCurrentSession: (session: PlaygroundSession | null) => {
        set({ currentSession: session });
      },

      updateParameters: (parameters: Partial<ModelParameters>) => {
        set((state) => ({
          defaultParameters: {
            ...state.defaultParameters,
            ...parameters,
          },
        }));
      },

      exportSessions: () => {
        return playgroundService.exportSessions();
      },

      importSessions: (sessionsJson: string) => {
        try {
          playgroundService.importSessions(sessionsJson);
          const sessions = playgroundService.getSessionHistory();
          set({ sessions });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to import sessions",
          });
        }
      },
    }),
    {
      name: "playground-store",
      partialize: (state) => ({
        defaultParameters: state.defaultParameters,
      }),
    },
  ),
);
