import type { Course } from "@/types";

export const agentDevelopmentCourse: Course = {
  id: "agent-development",
  title: "Agent Development",
  description:
    "Create autonomous AI agents that can reason, plan, and use tools. Learn about agent architectures, tool integration, memory systems, and multi-agent coordination.",
  slug: "agent-development",
  icon: "Bot",
  color: "orange",
  difficulty: "advanced",
  estimatedHours: 18,
  tags: ["agents", "tools", "planning", "reasoning", "automation"],
  prerequisites: ["ai-fundamentals", "prompt-engineering"],
  modules: [
    {
      id: "agent-fundamentals",
      courseId: "agent-development",
      title: "Agent Fundamentals",
      description: "Core concepts of AI agents",
      order: 1,
      estimatedMinutes: 60,
      lessons: [
        {
          id: "agent-architecture",
          moduleId: "agent-fundamentals",
          title: "Agent Architecture Patterns",
          slug: "agent-architecture",
          type: "reading",
          order: 1,
          estimatedMinutes: 20,
          objectives: [
            "Understand different agent architectures",
            "Learn about ReAct pattern",
            "Explore planning and reasoning strategies",
          ],
          content: `# Agent Architecture Patterns\n\n## What is an AI Agent?\n\nAn AI agent is an autonomous system that can:\n- Perceive its environment\n- Make decisions\n- Take actions to achieve goals\n- Learn from feedback\n\n## Common Architectures\n\n### ReAct (Reasoning + Acting)\n- Combines reasoning and action in an interleaved manner\n- Think → Act → Observe → Repeat\n\n### Plan-and-Execute\n- First creates a complete plan\n- Then executes steps sequentially\n\n### Reflexion\n- Includes self-reflection and error correction\n- Learns from mistakes to improve`,
        },
      ],
    },
  ],
};
