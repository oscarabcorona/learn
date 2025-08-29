import type { Course } from "@/types";

export const productionScalingCourse: Course = {
  id: "production-scaling",
  title: "Production & Scaling",
  description:
    "Deploy and scale AI applications in production. Learn about API design, cost optimization, monitoring, security, and best practices for reliable AI systems.",
  slug: "production-scaling",
  icon: "Rocket",
  color: "indigo",
  difficulty: "advanced",
  estimatedHours: 12,
  tags: ["deployment", "scaling", "monitoring", "optimization", "security"],
  prerequisites: ["ai-fundamentals", "prompt-engineering"],
  modules: [
    {
      id: "production-basics",
      courseId: "production-scaling",
      title: "Production Fundamentals",
      description: "Essential concepts for production AI systems",
      order: 1,
      estimatedMinutes: 45,
      lessons: [
        {
          id: "production-considerations",
          moduleId: "production-basics",
          title: "Production Considerations",
          slug: "production-considerations",
          type: "reading",
          order: 1,
          estimatedMinutes: 20,
          objectives: [
            "Understand production requirements",
            "Learn about reliability and scaling",
            "Explore monitoring and observability",
          ],
          content: `# Production Considerations\n\n## Key Requirements\n\n### Reliability\n- High availability (99.9%+ uptime)\n- Graceful degradation\n- Fallback mechanisms\n- Error handling\n\n### Performance\n- Low latency responses\n- High throughput\n- Efficient resource usage\n- Caching strategies\n\n### Cost Optimization\n- Token usage monitoring\n- Model selection (speed vs quality)\n- Batch processing\n- Rate limiting\n\n### Security\n- API key management\n- Input validation\n- Output filtering\n- PII protection`,
        },
      ],
    },
  ],
};
