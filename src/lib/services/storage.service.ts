// Storage Service - Abstraction for local storage operations
export interface IStorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

export class LocalStorageService implements IStorageService {
  private isClient = typeof window !== "undefined";

  get<T>(key: string): T | null {
    if (!this.isClient) return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isClient) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
    }
  }

  remove(key: string): void {
    if (!this.isClient) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
    }
  }

  clear(): void {
    if (!this.isClient) return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
}

// Storage keys enum for type safety
export enum StorageKeys {
  USER_PROGRESS = "ai_learn_progress",
  USER_SETTINGS = "ai_learn_settings",
  PLAYGROUND_HISTORY = "ai_learn_playground",
  ACHIEVEMENTS = "ai_learn_achievements",
  LAST_ACTIVITY = "ai_learn_last_activity",
}

// Singleton instance
export const storageService = new LocalStorageService();
