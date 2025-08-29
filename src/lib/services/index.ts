// Export all services from a single entry point
export { courseService } from "./course.service";
export { progressService } from "./progress.service";
export { exerciseService } from "./exercise.service";
export { playgroundService } from "./playground.service";
export { storageService, StorageKeys } from "./storage.service";

// Export interfaces for dependency injection
export type { ICourseService } from "./course.service";
export type { IProgressService } from "./progress.service";
export type {
  IExerciseService,
  ExerciseValidationResult,
  TestResult,
} from "./exercise.service";
export type { IPlaygroundService } from "./playground.service";
export type { IStorageService } from "./storage.service";
