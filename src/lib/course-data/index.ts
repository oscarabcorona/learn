import type { Course } from "@/types";
import { aiFundamentalsCourse } from "./ai-fundamentals";
import { promptEngineeringCourse } from "./prompt-engineering";
import { ragSystemsCourse } from "./rag-systems";
import { agentDevelopmentCourse } from "./agent-development";
import { fineTuningCourse } from "./fine-tuning";
import { productionScalingCourse } from "./production-scaling";

// Export all courses
export const courses: Course[] = [
  aiFundamentalsCourse,
  promptEngineeringCourse,
  ragSystemsCourse,
  agentDevelopmentCourse,
  fineTuningCourse,
  productionScalingCourse,
];

// Helper function to get all courses
export function getAllCourses(): Course[] {
  return courses;
}

// Helper function to get course by ID
export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

// Helper function to get course by slug
export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((course) => course.slug === slug);
}
