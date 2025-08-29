import type { Course } from "@/types";

export const promptEngineeringCourse: Course = {
  id: "prompt-engineering",
  title: "Prompt Engineering",
  description:
    "Master the art and science of crafting effective prompts. Learn systematic approaches to prompt design, advanced techniques, and best practices for getting optimal results from LLMs.",
  slug: "prompt-engineering",
  icon: "MessageSquare",
  color: "green",
  difficulty: "intermediate",
  estimatedHours: 10,
  tags: ["prompts", "few-shot", "chain-of-thought", "optimization"],
  prerequisites: ["ai-fundamentals"],
  modules: [
    {
      id: "prompt-basics",
      courseId: "prompt-engineering",
      title: "Prompt Engineering Fundamentals",
      description: "Learn the core principles of effective prompt design",
      order: 1,
      estimatedMinutes: 60,
      lessons: [
        {
          id: "prompt-principles",
          moduleId: "prompt-basics",
          title: "Core Principles of Prompt Design",
          slug: "prompt-principles",
          type: "reading",
          order: 1,
          estimatedMinutes: 20,
          objectives: [
            "Understand the importance of clear instructions",
            "Learn about context and role-setting",
            "Master output formatting techniques",
          ],
          content: `# Core Principles of Prompt Design\n\n## Clear and Specific Instructions\n\nThe foundation of good prompt engineering is clarity. Be explicit about what you want the model to do.\n\n### Bad Example:\n"Write about dogs"\n\n### Good Example:\n"Write a 200-word informative paragraph about the history of dog domestication, focusing on archaeological evidence and genetic studies."\n\n## Providing Context\n\nContext helps the model understand the task better:\n- Background information\n- Examples of desired output\n- Constraints and requirements\n- Target audience\n\n## Role and Persona Setting\n\nAssigning a role can improve response quality:\n- "You are an expert Python developer..."\n- "Act as a friendly teacher explaining to a 10-year-old..."\n- "You are a professional editor reviewing..."\n\n## Output Formatting\n\nStructure your desired output:\n- Use delimiters for clarity\n- Request specific formats (JSON, markdown, lists)\n- Define sections or components needed`,
        },
      ],
    },
  ],
};
