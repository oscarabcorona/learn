import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProgress, CourseProgress, ExerciseAttempt } from "@/types";
import { progressService } from "@/lib/services";

interface ProgressStore {
  // State
  userProgress: UserProgress | null;
  isLoading: boolean;

  // Actions
  loadProgress: () => void;
  startCourse: (courseId: string) => void;
  startModule: (courseId: string, moduleId: string) => void;
  startLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  completeLesson: (
    courseId: string,
    moduleId: string,
    lessonId: string,
  ) => void;
  recordExerciseAttempt: (lessonId: string, attempt: ExerciseAttempt) => void;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      userProgress: null,
      isLoading: false,

      loadProgress: () => {
        set({ isLoading: true });
        const progress = progressService.getUserProgress();
        set({ userProgress: progress, isLoading: false });
      },

      startCourse: (courseId: string) => {
        progressService.startCourse(courseId);
        const progress = progressService.getUserProgress();
        set({ userProgress: progress });
      },

      startModule: (courseId: string, moduleId: string) => {
        progressService.startModule(courseId, moduleId);
        const progress = progressService.getUserProgress();
        set({ userProgress: progress });
      },

      startLesson: (courseId: string, moduleId: string, lessonId: string) => {
        progressService.startLesson(courseId, moduleId, lessonId);
        const progress = progressService.getUserProgress();
        set({ userProgress: progress });
      },

      completeLesson: (
        courseId: string,
        moduleId: string,
        lessonId: string,
      ) => {
        progressService.completeLesson(courseId, moduleId, lessonId);
        const progress = progressService.getUserProgress();
        set({ userProgress: progress });
      },

      recordExerciseAttempt: (lessonId: string, attempt: ExerciseAttempt) => {
        progressService.recordExerciseAttempt(lessonId, attempt);
        const progress = progressService.getUserProgress();
        set({ userProgress: progress });
      },

      getCourseProgress: (courseId: string) => {
        const { userProgress } = get();
        return userProgress?.courses.find((c) => c.courseId === courseId);
      },

      resetProgress: () => {
        const emptyProgress: UserProgress = {
          userId: "local",
          courses: [],
          achievements: [],
          totalPoints: 0,
          streak: 0,
          lastActivityDate: new Date().toISOString(),
        };
        progressService.updateUserProgress(emptyProgress);
        set({ userProgress: emptyProgress });
      },
    }),
    {
      name: "progress-store",
      partialize: (state) => ({ userProgress: state.userProgress }),
    },
  ),
);
