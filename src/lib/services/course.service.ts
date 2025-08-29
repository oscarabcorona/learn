import type { Course, Module, Lesson, Exercise } from "@/types";
import { courses } from "@/lib/course-data";

// Course Service - Single Responsibility: Managing course content
export interface ICourseService {
  getAllCourses(): Course[];
  getCourseById(courseId: string): Course | undefined;
  getCourseBySlug(slug: string): Course | undefined;
  getModuleById(moduleId: string): Module | undefined;
  getLessonById(lessonId: string): Lesson | undefined;
  getLessonBySlug(courseSlug: string, lessonSlug: string): Lesson | undefined;
  getExerciseById(exerciseId: string): Exercise | undefined;
  searchCourses(query: string): Course[];
  getPrerequisiteCourses(courseId: string): Course[];
}

export class CourseService implements ICourseService {
  private courses: Course[] = courses;

  getAllCourses(): Course[] {
    return this.courses;
  }

  getCourseById(courseId: string): Course | undefined {
    return this.courses.find((course) => course.id === courseId);
  }

  getCourseBySlug(slug: string): Course | undefined {
    return this.courses.find((course) => course.slug === slug);
  }

  getModuleById(moduleId: string): Module | undefined {
    for (const course of this.courses) {
      const module = course.modules.find((m) => m.id === moduleId);
      if (module) return module;
    }
    return undefined;
  }

  getLessonById(lessonId: string): Lesson | undefined {
    for (const course of this.courses) {
      for (const module of course.modules) {
        const lesson = module.lessons.find((l) => l.id === lessonId);
        if (lesson) return lesson;
      }
    }
    return undefined;
  }

  getLessonBySlug(courseSlug: string, lessonSlug: string): Lesson | undefined {
    const course = this.getCourseBySlug(courseSlug);
    if (!course) return undefined;

    for (const module of course.modules) {
      const lesson = module.lessons.find((l) => l.slug === lessonSlug);
      if (lesson) return lesson;
    }
    return undefined;
  }

  getExerciseById(exerciseId: string): Exercise | undefined {
    for (const course of this.courses) {
      for (const module of course.modules) {
        for (const lesson of module.lessons) {
          if (lesson.exercise?.id === exerciseId) {
            return lesson.exercise;
          }
        }
      }
    }
    return undefined;
  }

  searchCourses(query: string): Course[] {
    const lowercaseQuery = query.toLowerCase();
    return this.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(lowercaseQuery) ||
        course.description.toLowerCase().includes(lowercaseQuery) ||
        course.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    );
  }

  getPrerequisiteCourses(courseId: string): Course[] {
    const course = this.getCourseById(courseId);
    if (!course || !course.prerequisites) return [];

    return course.prerequisites
      .map((prereqId) => this.getCourseById(prereqId))
      .filter((c): c is Course => c !== undefined);
  }

  // Helper method to get course for a lesson
  getCourseForLesson(lessonId: string): Course | undefined {
    for (const course of this.courses) {
      for (const module of course.modules) {
        if (module.lessons.some((l) => l.id === lessonId)) {
          return course;
        }
      }
    }
    return undefined;
  }

  // Helper method to get module for a lesson
  getModuleForLesson(lessonId: string): Module | undefined {
    for (const course of this.courses) {
      for (const module of course.modules) {
        if (module.lessons.some((l) => l.id === lessonId)) {
          return module;
        }
      }
    }
    return undefined;
  }

  // Get next lesson in the learning path
  getNextLesson(currentLessonId: string): Lesson | undefined {
    const module = this.getModuleForLesson(currentLessonId);
    if (!module) return undefined;

    const currentIndex = module.lessons.findIndex(
      (l) => l.id === currentLessonId,
    );
    if (currentIndex === -1) return undefined;

    // Check if there's a next lesson in the same module
    if (currentIndex < module.lessons.length - 1) {
      return module.lessons[currentIndex + 1];
    }

    // Check for next module in the course
    const course = this.getCourseForLesson(currentLessonId);
    if (!course) return undefined;

    const moduleIndex = course.modules.findIndex((m) => m.id === module.id);
    if (moduleIndex < course.modules.length - 1) {
      const nextModule = course.modules[moduleIndex + 1];
      return nextModule.lessons[0];
    }

    return undefined;
  }

  // Get previous lesson in the learning path
  getPreviousLesson(currentLessonId: string): Lesson | undefined {
    const module = this.getModuleForLesson(currentLessonId);
    if (!module) return undefined;

    const currentIndex = module.lessons.findIndex(
      (l) => l.id === currentLessonId,
    );
    if (currentIndex === -1) return undefined;

    // Check if there's a previous lesson in the same module
    if (currentIndex > 0) {
      return module.lessons[currentIndex - 1];
    }

    // Check for previous module in the course
    const course = this.getCourseForLesson(currentLessonId);
    if (!course) return undefined;

    const moduleIndex = course.modules.findIndex((m) => m.id === module.id);
    if (moduleIndex > 0) {
      const previousModule = course.modules[moduleIndex - 1];
      return previousModule.lessons[previousModule.lessons.length - 1];
    }

    return undefined;
  }
}

// Singleton instance
export const courseService = new CourseService();
