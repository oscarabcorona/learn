import type {
  UserProgress,
  CourseProgress,
  ModuleProgress,
  LessonProgress,
  ExerciseAttempt,
  Achievement,
} from "@/types";
import {
  IStorageService,
  storageService,
  StorageKeys,
} from "./storage.service";
import { courseService } from "./course.service";

// Progress Service - Single Responsibility: Managing user progress
export interface IProgressService {
  getUserProgress(): UserProgress;
  updateUserProgress(progress: UserProgress): void;
  startCourse(courseId: string): void;
  completeCourse(courseId: string): void;
  startModule(courseId: string, moduleId: string): void;
  completeModule(courseId: string, moduleId: string): void;
  startLesson(courseId: string, moduleId: string, lessonId: string): void;
  completeLesson(courseId: string, moduleId: string, lessonId: string): void;
  recordExerciseAttempt(lessonId: string, attempt: ExerciseAttempt): void;
  getCourseProgress(courseId: string): CourseProgress | undefined;
  getModuleProgress(
    courseId: string,
    moduleId: string,
  ): ModuleProgress | undefined;
  getLessonProgress(
    courseId: string,
    moduleId: string,
    lessonId: string,
  ): LessonProgress | undefined;
  calculateStreak(): number;
  getTotalPoints(): number;
  checkAchievements(): Achievement[];
}

export class ProgressService implements IProgressService {
  constructor(private storage: IStorageService = storageService) {}

  private createEmptyProgress(): UserProgress {
    return {
      userId: "local",
      courses: [],
      achievements: [],
      totalPoints: 0,
      streak: 0,
      lastActivityDate: new Date().toISOString(),
    };
  }

  getUserProgress(): UserProgress {
    const progress = this.storage.get<UserProgress>(StorageKeys.USER_PROGRESS);
    return progress || this.createEmptyProgress();
  }

  updateUserProgress(progress: UserProgress): void {
    progress.lastActivityDate = new Date().toISOString();
    progress.streak = this.calculateStreak();
    progress.totalPoints = this.getTotalPoints();
    this.storage.set(StorageKeys.USER_PROGRESS, progress);
  }

  startCourse(courseId: string): void {
    const progress = this.getUserProgress();

    // Check if course already started
    if (progress.courses.find((c) => c.courseId === courseId)) {
      return;
    }

    const courseProgress: CourseProgress = {
      courseId,
      startedAt: new Date().toISOString(),
      modules: [],
      completionPercentage: 0,
      totalTimeSpent: 0,
    };

    progress.courses.push(courseProgress);
    this.updateUserProgress(progress);
  }

  completeCourse(courseId: string): void {
    const progress = this.getUserProgress();
    const courseProgress = progress.courses.find(
      (c) => c.courseId === courseId,
    );

    if (courseProgress) {
      courseProgress.completedAt = new Date().toISOString();
      courseProgress.completionPercentage = 100;
      this.updateUserProgress(progress);
    }
  }

  startModule(courseId: string, moduleId: string): void {
    const progress = this.getUserProgress();
    let courseProgress = progress.courses.find((c) => c.courseId === courseId);

    // Start course if not started
    if (!courseProgress) {
      this.startCourse(courseId);
      courseProgress = progress.courses.find((c) => c.courseId === courseId)!;
    }

    // Check if module already started
    if (courseProgress.modules.find((m) => m.moduleId === moduleId)) {
      return;
    }

    const moduleProgress: ModuleProgress = {
      moduleId,
      startedAt: new Date().toISOString(),
      lessons: [],
      completionPercentage: 0,
    };

    courseProgress.modules.push(moduleProgress);
    this.updateCourseCompletion(courseProgress);
    this.updateUserProgress(progress);
  }

  completeModule(courseId: string, moduleId: string): void {
    const progress = this.getUserProgress();
    const courseProgress = progress.courses.find(
      (c) => c.courseId === courseId,
    );

    if (courseProgress) {
      const moduleProgress = courseProgress.modules.find(
        (m) => m.moduleId === moduleId,
      );
      if (moduleProgress) {
        moduleProgress.completedAt = new Date().toISOString();
        moduleProgress.completionPercentage = 100;
        this.updateCourseCompletion(courseProgress);
        this.updateUserProgress(progress);
      }
    }
  }

  startLesson(courseId: string, moduleId: string, lessonId: string): void {
    const progress = this.getUserProgress();

    // Ensure course and module are started
    this.startModule(courseId, moduleId);

    // Re-fetch the progress after startModule to get the updated state
    const updatedProgress = this.getUserProgress();
    const courseProgress = updatedProgress.courses.find(
      (c) => c.courseId === courseId,
    );
    
    if (!courseProgress) {
      console.error(`Course ${courseId} not found in progress`);
      return;
    }

    const moduleProgress = courseProgress.modules.find(
      (m) => m.moduleId === moduleId,
    );

    if (!moduleProgress) {
      console.error(`Module ${moduleId} not found in course ${courseId}`);
      return;
    }

    // Ensure lessons array exists
    if (!moduleProgress.lessons) {
      moduleProgress.lessons = [];
    }

    // Check if lesson already started
    if (moduleProgress.lessons.find((l) => l.lessonId === lessonId)) {
      return;
    }

    const lessonProgress: LessonProgress = {
      lessonId,
      startedAt: new Date().toISOString(),
      timeSpent: 0,
      exerciseAttempts: [],
    };

    moduleProgress.lessons.push(lessonProgress);
    this.updateModuleCompletion(moduleProgress, moduleId);
    this.updateCourseCompletion(courseProgress);
    this.updateUserProgress(progress);
  }

  completeLesson(courseId: string, moduleId: string, lessonId: string): void {
    const progress = this.getUserProgress();
    const courseProgress = progress.courses.find(
      (c) => c.courseId === courseId,
    );

    if (courseProgress) {
      const moduleProgress = courseProgress.modules.find(
        (m) => m.moduleId === moduleId,
      );
      if (moduleProgress) {
        const lessonProgress = moduleProgress.lessons.find(
          (l) => l.lessonId === lessonId,
        );
        if (lessonProgress) {
          lessonProgress.completedAt = new Date().toISOString();
          this.updateModuleCompletion(moduleProgress, moduleId);
          this.updateCourseCompletion(courseProgress);

          // Check if module is complete
          const module = courseService.getModuleById(moduleId);
          if (
            module &&
            moduleProgress.lessons.length === module.lessons.length
          ) {
            const allLessonsComplete = moduleProgress.lessons.every(
              (l) => l.completedAt,
            );
            if (allLessonsComplete) {
              this.completeModule(courseId, moduleId);
            }
          }

          // Check if course is complete
          const course = courseService.getCourseById(courseId);
          if (
            course &&
            courseProgress.modules.length === course.modules.length
          ) {
            const allModulesComplete = courseProgress.modules.every(
              (m) => m.completedAt,
            );
            if (allModulesComplete) {
              this.completeCourse(courseId);
            }
          }

          this.updateUserProgress(progress);
        }
      }
    }
  }

  recordExerciseAttempt(lessonId: string, attempt: ExerciseAttempt): void {
    const progress = this.getUserProgress();

    for (const courseProgress of progress.courses) {
      for (const moduleProgress of courseProgress.modules) {
        const lessonProgress = moduleProgress.lessons.find(
          (l) => l.lessonId === lessonId,
        );
        if (lessonProgress) {
          if (!lessonProgress.exerciseAttempts) {
            lessonProgress.exerciseAttempts = [];
          }
          lessonProgress.exerciseAttempts.push(attempt);
          lessonProgress.timeSpent += attempt.timeSpent;
          courseProgress.totalTimeSpent += attempt.timeSpent;
          this.updateUserProgress(progress);
          return;
        }
      }
    }
  }

  getCourseProgress(courseId: string): CourseProgress | undefined {
    const progress = this.getUserProgress();
    return progress.courses.find((c) => c.courseId === courseId);
  }

  getModuleProgress(
    courseId: string,
    moduleId: string,
  ): ModuleProgress | undefined {
    const courseProgress = this.getCourseProgress(courseId);
    return courseProgress?.modules.find((m) => m.moduleId === moduleId);
  }

  getLessonProgress(
    courseId: string,
    moduleId: string,
    lessonId: string,
  ): LessonProgress | undefined {
    const moduleProgress = this.getModuleProgress(courseId, moduleId);
    return moduleProgress?.lessons.find((l) => l.lessonId === lessonId);
  }

  calculateStreak(): number {
    const progress = this.getUserProgress();
    const lastActivity = new Date(progress.lastActivityDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If last activity was today or yesterday, maintain streak
    if (diffDays <= 1) {
      return progress.streak + (diffDays === 1 ? 1 : 0);
    }

    // Streak broken
    return 0;
  }

  getTotalPoints(): number {
    const progress = this.getUserProgress();
    let totalPoints = 0;

    // Points from completed exercises
    for (const courseProgress of progress.courses) {
      for (const moduleProgress of courseProgress.modules) {
        for (const lessonProgress of moduleProgress.lessons) {
          if (lessonProgress.exerciseAttempts) {
            for (const attempt of lessonProgress.exerciseAttempts) {
              if (attempt.completed && attempt.score) {
                totalPoints += attempt.score;
              }
            }
          }
        }
      }
    }

    // Points from achievements
    totalPoints += progress.achievements.reduce((sum, a) => sum + a.points, 0);

    return totalPoints;
  }

  checkAchievements(): Achievement[] {
    // This would check various criteria and unlock achievements
    // Implementation depends on achievement definitions
    return [];
  }

  private updateModuleCompletion(
    moduleProgress: ModuleProgress,
    moduleId: string,
  ): void {
    const module = courseService.getModuleById(moduleId);
    if (!module) return;

    const totalLessons = module.lessons.length;
    const completedLessons = moduleProgress.lessons.filter(
      (l) => l.completedAt,
    ).length;
    moduleProgress.completionPercentage =
      (completedLessons / totalLessons) * 100;
  }

  private updateCourseCompletion(courseProgress: CourseProgress): void {
    const course = courseService.getCourseById(courseProgress.courseId);
    if (!course) return;

    let totalLessons = 0;
    let completedLessons = 0;

    for (const module of course.modules) {
      totalLessons += module.lessons.length;
      const moduleProgress = courseProgress.modules.find(
        (m) => m.moduleId === module.id,
      );
      if (moduleProgress) {
        completedLessons += moduleProgress.lessons.filter(
          (l) => l.completedAt,
        ).length;
      }
    }

    courseProgress.completionPercentage =
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  }
}

// Singleton instance
export const progressService = new ProgressService();
