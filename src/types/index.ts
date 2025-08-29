// Course and Learning Types
export interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  color: string;
  modules: Module[];
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites?: string[];
  tags: string[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  estimatedMinutes: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  type: "reading" | "video" | "interactive" | "exercise";
  content: string; // Markdown content
  order: number;
  estimatedMinutes: number;
  objectives: string[];
  resources?: Resource[];
  exercise?: Exercise;
}

export interface Resource {
  title: string;
  url: string;
  type: "documentation" | "article" | "video" | "github" | "paper";
}

// Exercise Types
export interface Exercise {
  id: string;
  lessonId?: string;
  title: string;
  description: string;
  type: "code" | "quiz" | "project" | "playground";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  content: ExerciseContent;
  hints?: string[];
  solution?: string;
  testCases?: TestCase[];
}

export type ExerciseContent =
  | CodeExercise
  | QuizExercise
  | ProjectExercise
  | PlaygroundExercise;

export interface CodeExercise {
  type: "code";
  prompt: string;
  starterCode: string;
  language: "javascript" | "typescript" | "python";
  expectedOutput?: string;
  validator?: string; // Function as string to validate solution
}

export interface QuizExercise {
  type: "quiz";
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number | number[]; // Index or indices for multiple correct
  explanation: string;
  multipleChoice: boolean;
}

export interface ProjectExercise {
  type: "project";
  requirements: string[];
  deliverables: string[];
  evaluationCriteria: string[];
  resources: Resource[];
}

export interface PlaygroundExercise {
  type: "playground";
  prompt: string;
  systemPrompt?: string;
  examples?: PlaygroundExample[];
  evaluationPrompt?: string;
}

export interface PlaygroundExample {
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
  hidden?: boolean;
}

// Progress Tracking Types
export interface UserProgress {
  userId: string; // For future use, currently will be 'local'
  courses: CourseProgress[];
  achievements: Achievement[];
  totalPoints: number;
  streak: number;
  lastActivityDate: string;
}

export interface CourseProgress {
  courseId: string;
  startedAt: string;
  completedAt?: string;
  modules: ModuleProgress[];
  completionPercentage: number;
  totalTimeSpent: number; // in minutes
}

export interface ModuleProgress {
  moduleId: string;
  startedAt: string;
  completedAt?: string;
  lessons: LessonProgress[];
  completionPercentage: number;
}

export interface LessonProgress {
  lessonId: string;
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in minutes
  exerciseAttempts?: ExerciseAttempt[];
}

export interface ExerciseAttempt {
  exerciseId: string;
  attemptedAt: string;
  completed: boolean;
  score?: number;
  solution?: string;
  feedback?: string;
  timeSpent: number; // in minutes
}

// Achievement System
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  criteria: AchievementCriteria;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface AchievementCriteria {
  type:
    | "lessons_completed"
    | "exercises_solved"
    | "streak"
    | "points"
    | "course_completed"
    | "perfect_module";
  value: number;
  courseId?: string;
  moduleId?: string;
}

// API Playground Types
export interface PlaygroundSession {
  id: string;
  prompt: string;
  systemPrompt?: string;
  model: AIModel;
  parameters: ModelParameters;
  response?: string;
  error?: string;
  timestamp: string;
  tokensUsed?: TokenUsage;
}

export interface AIModel {
  provider: "anthropic" | "openai";
  name: string;
  maxTokens: number;
}

export interface ModelParameters {
  temperature: number;
  maxTokens: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost?: number;
}

// Settings Types
export interface UserSettings {
  theme: "light" | "dark" | "system";
  codeTheme: string;
  fontSize: "small" | "medium" | "large";
  apiKeys: APIKeys;
  notifications: NotificationSettings;
  learning: LearningSettings;
}

export interface APIKeys {
  anthropic?: string;
  openai?: string;
}

export interface NotificationSettings {
  achievements: boolean;
  dailyReminder: boolean;
  weeklyProgress: boolean;
}

export interface LearningSettings {
  dailyGoal: number; // minutes
  preferredDifficulty: "beginner" | "intermediate" | "advanced";
  autoPlayVideos: boolean;
  showHints: boolean;
}
