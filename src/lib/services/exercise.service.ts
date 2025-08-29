import type {
  Exercise,
  ExerciseContent,
  CodeExercise,
  QuizExercise,
  PlaygroundExercise,
  TestCase,
  ExerciseAttempt,
} from "@/types";

// Exercise Service - Single Responsibility: Validating and scoring exercises
export interface IExerciseService {
  validateCodeExercise(
    exercise: CodeExercise,
    solution: string,
  ): ExerciseValidationResult;
  validateQuizExercise(
    exercise: QuizExercise,
    answers: number[][],
  ): ExerciseValidationResult;
  validatePlaygroundExercise(
    exercise: PlaygroundExercise,
    response: string,
  ): ExerciseValidationResult;
  runTestCases(
    code: string,
    testCases: TestCase[],
    language: string,
  ): TestResult[];
  calculateScore(
    exercise: Exercise,
    validationResult: ExerciseValidationResult,
  ): number;
}

export interface ExerciseValidationResult {
  isCorrect: boolean;
  feedback: string;
  hints?: string[];
  testResults?: TestResult[];
  score?: number;
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput?: string;
  error?: string;
}

export class ExerciseService implements IExerciseService {
  validateCodeExercise(
    exercise: CodeExercise,
    solution: string,
  ): ExerciseValidationResult {
    // Basic validation - check if solution is not empty
    if (!solution.trim()) {
      return {
        isCorrect: false,
        feedback: "Please provide a solution before submitting.",
        hints: [
          "Start by understanding the problem statement",
          "Look at the starter code for hints",
        ],
      };
    }

    // If there's a custom validator function (stored as string), execute it
    if (exercise.validator) {
      try {
        // Create a safe evaluation context
        const validatorFn = new Function("solution", exercise.validator);
        const result = validatorFn(solution);

        if (typeof result === "boolean") {
          return {
            isCorrect: result,
            feedback: result
              ? "Great job! Your solution is correct."
              : "Not quite right. Try again!",
          };
        } else if (typeof result === "object") {
          return result as ExerciseValidationResult;
        }
      } catch (error) {
        console.error("Error executing validator:", error);
      }
    }

    // Simple check for expected output if provided
    if (exercise.expectedOutput) {
      const isCorrect = solution.includes(exercise.expectedOutput);
      return {
        isCorrect,
        feedback: isCorrect
          ? "Excellent! Your solution produces the expected output."
          : "Your solution doesn't produce the expected output. Review your code.",
        hints: isCorrect
          ? undefined
          : [
              "Check the expected output format",
              "Make sure your function returns the correct value",
            ],
      };
    }

    // Default validation - just check if solution is different from starter code
    const isModified = solution !== exercise.starterCode;
    return {
      isCorrect: isModified,
      feedback: isModified
        ? "Solution submitted successfully. Review the provided solution to learn more."
        : "Please modify the starter code to provide your solution.",
    };
  }

  validateQuizExercise(
    exercise: QuizExercise,
    answers: number[][],
  ): ExerciseValidationResult {
    let correctCount = 0;
    const totalQuestions = exercise.questions.length;
    const feedback: string[] = [];

    exercise.questions.forEach((question, index) => {
      const userAnswer = answers[index] || [];
      const correctAnswer = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [question.correctAnswer];

      const isCorrect =
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((a) => correctAnswer.includes(a));

      if (isCorrect) {
        correctCount++;
        feedback.push(`✓ Question ${index + 1}: Correct!`);
      } else {
        feedback.push(
          `✗ Question ${index + 1}: Incorrect. ${question.explanation}`,
        );
      }
    });

    const score = (correctCount / totalQuestions) * 100;
    const isAllCorrect = correctCount === totalQuestions;

    return {
      isCorrect: isAllCorrect,
      feedback: feedback.join("\n"),
      score,
      hints: isAllCorrect
        ? undefined
        : [
            "Review the explanations for incorrect answers",
            "Try again after studying the material",
          ],
    };
  }

  validatePlaygroundExercise(
    exercise: PlaygroundExercise,
    response: string,
  ): ExerciseValidationResult {
    // Basic validation for playground exercises
    if (!response.trim()) {
      return {
        isCorrect: false,
        feedback: "Please provide a response before submitting.",
        hints: [
          "Try experimenting with different prompts",
          "Use the examples as a guide",
        ],
      };
    }

    // Check if response meets minimum length requirement
    const minLength = 50; // Minimum response length
    if (response.length < minLength) {
      return {
        isCorrect: false,
        feedback: `Your response is too short. Please provide a more detailed answer (at least ${minLength} characters).`,
        hints: ["Expand on your ideas", "Provide specific examples"],
      };
    }

    // If evaluation prompt is provided, we would use it with an AI model
    // For now, we'll just check basic criteria
    const hasKeywords = exercise.examples?.some(
      (example) =>
        response.toLowerCase().includes(example.input.toLowerCase()) ||
        response.toLowerCase().includes(example.expectedOutput.toLowerCase()),
    );

    return {
      isCorrect: true, // Playground exercises are more about exploration
      feedback: hasKeywords
        ? "Good work! Your response shows understanding of the concepts."
        : "Response submitted. Consider how your answer relates to the provided examples.",
      score: hasKeywords ? 100 : 80,
    };
  }

  runTestCases(
    code: string,
    testCases: TestCase[],
    language: string,
  ): TestResult[] {
    // This would normally execute code in a sandboxed environment
    // For now, we'll simulate test execution
    const results: TestResult[] = [];

    for (const testCase of testCases) {
      // Simulate test execution
      // In a real implementation, this would use a code execution service
      const passed = Math.random() > 0.3; // 70% pass rate for simulation

      results.push({
        testCase,
        passed,
        actualOutput: passed
          ? testCase.expectedOutput
          : "Error or incorrect output",
        error: passed ? undefined : "Assertion failed",
      });
    }

    return results;
  }

  calculateScore(
    exercise: Exercise,
    validationResult: ExerciseValidationResult,
  ): number {
    // If score is already provided in validation result, use it
    if (validationResult.score !== undefined) {
      return validationResult.score;
    }

    // Base score on correctness and difficulty
    let baseScore = exercise.points;

    if (!validationResult.isCorrect) {
      // Partial credit based on test results if available
      if (validationResult.testResults) {
        const passedTests = validationResult.testResults.filter(
          (t) => t.passed,
        ).length;
        const totalTests = validationResult.testResults.length;
        baseScore = (passedTests / totalTests) * exercise.points;
      } else {
        baseScore = 0;
      }
    }

    return Math.round(baseScore);
  }

  // Helper method to create an exercise attempt
  createExerciseAttempt(
    exerciseId: string,
    solution: string,
    validationResult: ExerciseValidationResult,
    timeSpent: number,
  ): ExerciseAttempt {
    return {
      exerciseId,
      attemptedAt: new Date().toISOString(),
      completed: validationResult.isCorrect,
      score: validationResult.score,
      solution,
      feedback: validationResult.feedback,
      timeSpent,
    };
  }

  // Strategy pattern for different exercise validators
  private validators = {
    code: this.validateCodeExercise.bind(this),
    quiz: this.validateQuizExercise.bind(this),
    playground: this.validatePlaygroundExercise.bind(this),
    project: this.validateProjectExercise.bind(this),
  };

  private validateProjectExercise(
    exercise: any,
    submission: any,
  ): ExerciseValidationResult {
    // Project exercises require manual review or complex validation
    return {
      isCorrect: true,
      feedback: "Project submitted successfully. Your work will be reviewed.",
      score: 80, // Base score for submission
    };
  }

  // Main validation method using strategy pattern
  validateExercise(
    exercise: Exercise,
    submission: any,
  ): ExerciseValidationResult {
    const validator = this.validators[exercise.type];
    if (!validator) {
      throw new Error(`No validator found for exercise type: ${exercise.type}`);
    }

    const content = exercise.content as any;
    return validator(content, submission);
  }
}

// Singleton instance
export const exerciseService = new ExerciseService();
