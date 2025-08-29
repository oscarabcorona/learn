import type { Course } from "@/types";

export const ragSystemsCourse: Course = {
  id: "rag-systems",
  title: "RAG Systems",
  description:
    "Build powerful Retrieval-Augmented Generation systems. Learn about vector databases, embeddings, chunking strategies, and advanced retrieval techniques.",
  slug: "rag-systems",
  icon: "Database",
  color: "purple",
  difficulty: "advanced",
  estimatedHours: 15,
  tags: ["rag", "embeddings", "vector-db", "retrieval", "search"],
  prerequisites: ["ai-fundamentals", "prompt-engineering"],
  modules: [
    {
      id: "rag-intro",
      courseId: "rag-systems",
      title: "Introduction to RAG",
      description: "Understanding Retrieval-Augmented Generation",
      order: 1,
      estimatedMinutes: 45,
      lessons: [
        {
          id: "what-is-rag",
          moduleId: "rag-intro",
          title: "What is RAG?",
          slug: "what-is-rag",
          type: "reading",
          order: 1,
          estimatedMinutes: 15,
          objectives: [
            "Understand the RAG architecture",
            "Learn why RAG is important",
            "Explore RAG use cases",
          ],
          content: `# What is RAG?\n\n## Definition\n\nRetrieval-Augmented Generation (RAG) combines the power of large language models with external knowledge bases to provide more accurate, up-to-date, and verifiable responses.\n\n## The RAG Pipeline\n\n1. **Query Processing**: User question is processed\n2. **Retrieval**: Relevant documents are retrieved from a knowledge base\n3. **Augmentation**: Retrieved context is added to the prompt\n4. **Generation**: LLM generates response using the context\n\n## Benefits of RAG\n\n- **Reduced Hallucinations**: Grounds responses in actual data\n- **Up-to-date Information**: Can access current information\n- **Domain Specificity**: Incorporates specialized knowledge\n- **Transparency**: Can cite sources`,
        },
      ],
    },
  ],
};
