import type { Course } from "@/types";

export const fineTuningCourse: Course = {
  id: "fine-tuning",
  title: "Fine-tuning & Training",
  description:
    "Learn how to customize LLMs for specific tasks. Master dataset preparation, fine-tuning techniques like LoRA, evaluation metrics, and deployment strategies.",
  slug: "fine-tuning",
  icon: "Wrench",
  color: "red",
  difficulty: "advanced",
  estimatedHours: 14,
  tags: ["fine-tuning", "training", "lora", "datasets", "evaluation"],
  prerequisites: ["ai-fundamentals"],
  modules: [
    {
      id: "fine-tuning-basics",
      courseId: "fine-tuning",
      title: "Fine-tuning Basics",
      description: "Introduction to model fine-tuning",
      order: 1,
      estimatedMinutes: 50,
      lessons: [
        {
          id: "why-fine-tune",
          moduleId: "fine-tuning-basics",
          title: "Why Fine-tune Models?",
          slug: "why-fine-tune",
          type: "reading",
          order: 1,
          estimatedMinutes: 15,
          objectives: [
            "Understand when to fine-tune vs prompt",
            "Learn about different fine-tuning approaches",
            "Explore cost-benefit analysis",
          ],
          content: `# Why Fine-tune Models?\n\n## When to Fine-tune\n\n### Good Use Cases:\n- Domain-specific language or terminology\n- Consistent output format requirements\n- Improved performance on specific tasks\n- Reducing prompt length for production\n\n### When NOT to Fine-tune:\n- General knowledge tasks\n- One-off or rare use cases\n- When prompt engineering suffices\n- Limited training data available\n\n## Fine-tuning Approaches\n\n1. **Full Fine-tuning**: Update all model parameters\n2. **LoRA**: Low-Rank Adaptation - efficient parameter updates\n3. **QLoRA**: Quantized LoRA for reduced memory\n4. **Prefix Tuning**: Learn task-specific prefixes\n5. **Adapter Layers**: Add small trainable modules`,
        },
      ],
    },
  ],
};
