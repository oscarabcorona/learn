import type { Course } from "@/types";

export const aiFundamentalsCourse: Course = {
  id: "ai-fundamentals",
  title: "AI Fundamentals",
  description:
    "Master the core concepts of AI and Large Language Models. Learn about transformers, tokenization, embeddings, and the architecture that powers modern AI systems.",
  slug: "ai-fundamentals",
  icon: "Brain",
  color: "blue",
  difficulty: "beginner",
  estimatedHours: 12,
  tags: ["fundamentals", "transformers", "llm", "neural-networks"],
  modules: [
    {
      id: "ai-intro",
      courseId: "ai-fundamentals",
      title: "Introduction to AI and LLMs",
      description:
        "Understanding the landscape of artificial intelligence and large language models",
      order: 1,
      estimatedMinutes: 90,
      lessons: [
        {
          id: "ai-history",
          moduleId: "ai-intro",
          title: "History and Evolution of AI",
          slug: "history-evolution",
          type: "reading",
          order: 1,
          estimatedMinutes: 20,
          objectives: [
            "Understand the timeline of AI development",
            "Learn about key breakthroughs in LLM technology",
            "Recognize the impact of transformers on modern AI",
          ],
          content: `# History and Evolution of AI

## The Journey to Modern LLMs

Artificial Intelligence has evolved dramatically since its inception in the 1950s. Let's explore the key milestones that led to today's powerful language models.

### Early Foundations (1950s-1980s)
- **1950**: Alan Turing proposes the Turing Test
- **1956**: The term "Artificial Intelligence" is coined at Dartmouth Conference
- **1966**: ELIZA, the first chatbot, demonstrates natural language processing

### The AI Winters and Resurgence (1980s-2000s)
- Multiple periods of reduced funding and interest
- Rise of machine learning and statistical approaches
- Introduction of neural networks and backpropagation

### The Deep Learning Revolution (2010s)
- **2012**: AlexNet wins ImageNet competition
- **2014**: Introduction of Generative Adversarial Networks (GANs)
- **2017**: "Attention is All You Need" paper introduces Transformers

### The Era of Large Language Models (2018-Present)
- **2018**: BERT revolutionizes NLP tasks
- **2020**: GPT-3 demonstrates emergent abilities at scale
- **2022**: ChatGPT brings LLMs to mainstream
- **2023-2024**: Multimodal models and improved reasoning capabilities

## Key Takeaways
- AI has progressed from rule-based systems to learning-based approaches
- The transformer architecture was a breakthrough that enabled modern LLMs
- Scale (data, compute, parameters) has been crucial to recent advances`,
          resources: [
            {
              title: "Attention Is All You Need Paper",
              url: "https://arxiv.org/abs/1706.03762",
              type: "paper",
            },
            {
              title: "The Illustrated Transformer",
              url: "https://jalammar.github.io/illustrated-transformer/",
              type: "article",
            },
          ],
        },
        {
          id: "llm-basics",
          moduleId: "ai-intro",
          title: "What are Large Language Models?",
          slug: "llm-basics",
          type: "interactive",
          order: 2,
          estimatedMinutes: 30,
          objectives: [
            'Define what makes a model a "Large Language Model"',
            "Understand the concept of parameters and scale",
            "Learn about different model families and architectures",
          ],
          content: `# What are Large Language Models?

## Definition and Characteristics

A **Large Language Model (LLM)** is a type of artificial intelligence model that:
1. Is trained on vast amounts of text data
2. Contains billions of parameters
3. Can understand and generate human-like text
4. Exhibits emergent abilities at scale

## Key Components

### Parameters
Parameters are the learned weights in the neural network. Modern LLMs have:
- GPT-3: 175 billion parameters
- GPT-4: Estimated 1.7 trillion parameters
- Claude 3: Undisclosed, but comparable scale

### Training Data
LLMs are trained on diverse text sources:
- Web pages and articles
- Books and academic papers
- Code repositories
- Reference materials

### Architecture
Most modern LLMs use the Transformer architecture:
- Self-attention mechanism
- Parallel processing capabilities
- Positional encoding for sequence understanding

## Model Families

### Decoder-Only Models (GPT Family)
- Autoregressive generation
- Good for creative tasks and general assistance
- Examples: GPT-4, Claude, LLaMA

### Encoder-Decoder Models (T5, BART)
- Good for translation and summarization
- Can handle input-output transformations

### Encoder-Only Models (BERT Family)
- Bidirectional understanding
- Excellent for classification and analysis
- Not typically used for generation

## Interactive Exercise
Try predicting the next word in these sequences to understand how LLMs work:
1. "The capital of France is ___"
2. "To be or not to ___"
3. "import numpy as ___"

Notice how context helps you predict the most likely continuation!`,
          exercise: {
            id: "llm-basics-quiz",
            title: "LLM Fundamentals Quiz",
            description: "Test your understanding of Large Language Models",
            type: "quiz",
            difficulty: "easy",
            points: 10,
            content: {
              type: "quiz",
              questions: [
                {
                  id: "q1",
                  question: "What does LLM stand for?",
                  options: [
                    "Large Learning Machine",
                    "Large Language Model",
                    "Linear Language Model",
                    "Linguistic Learning Model",
                  ],
                  correctAnswer: 1,
                  explanation:
                    "LLM stands for Large Language Model, referring to AI models trained on vast text data.",
                  multipleChoice: false,
                },
                {
                  id: "q2",
                  question: "Which architecture do most modern LLMs use?",
                  options: [
                    "Convolutional Neural Networks",
                    "Recurrent Neural Networks",
                    "Transformer",
                    "Random Forest",
                  ],
                  correctAnswer: 2,
                  explanation:
                    "The Transformer architecture, introduced in 2017, is the foundation of modern LLMs.",
                  multipleChoice: false,
                },
                {
                  id: "q3",
                  question: "What are parameters in an LLM?",
                  options: [
                    "User settings for the model",
                    "Learned weights in the neural network",
                    "Input tokens",
                    "Output configurations",
                  ],
                  correctAnswer: 1,
                  explanation:
                    "Parameters are the learned weights that the model adjusts during training.",
                  multipleChoice: false,
                },
              ],
            },
          },
        },
        {
          id: "ai-capabilities",
          moduleId: "ai-intro",
          title: "Capabilities and Limitations",
          slug: "capabilities-limitations",
          type: "reading",
          order: 3,
          estimatedMinutes: 25,
          objectives: [
            "Understand what LLMs can and cannot do",
            "Learn about emergent abilities",
            "Recognize common limitations and biases",
          ],
          content: `# Capabilities and Limitations of LLMs

## What LLMs Can Do Well

### Language Understanding and Generation
- **Text Completion**: Predicting and generating coherent continuations
- **Translation**: Converting between languages
- **Summarization**: Condensing long texts while preserving key information
- **Question Answering**: Providing informative responses to queries

### Reasoning and Analysis
- **Pattern Recognition**: Identifying patterns in text and data
- **Logical Reasoning**: Following logical steps to reach conclusions
- **Code Generation**: Writing functional code in multiple languages
- **Creative Writing**: Generating stories, poems, and creative content

### Emergent Abilities
As models scale, they develop capabilities not explicitly trained for:
- In-context learning (few-shot prompting)
- Chain-of-thought reasoning
- Task decomposition
- Cross-domain knowledge transfer

## Current Limitations

### Knowledge and Factuality
- **Training Data Cutoff**: No knowledge of events after training
- **Hallucinations**: May generate plausible-sounding but false information
- **Inconsistency**: Can give different answers to the same question

### Reasoning Limitations
- **Complex Mathematics**: Struggles with multi-step calculations
- **Spatial Reasoning**: Limited understanding of 3D relationships
- **Causal Reasoning**: Difficulty with complex cause-effect chains

### Technical Constraints
- **Context Window**: Limited amount of text that can be processed at once
- **Token Limits**: Restrictions on input and output length
- **Computational Cost**: Expensive to run at scale

### Bias and Safety Concerns
- **Training Data Biases**: Reflects biases present in training data
- **Lack of Real-World Grounding**: No direct experience of the physical world
- **Potential for Misuse**: Can be used to generate harmful content

## Best Practices for Working with LLMs

1. **Verify Important Information**: Always fact-check critical information
2. **Use for Augmentation, Not Replacement**: LLMs work best as tools to enhance human capabilities
3. **Understand the Context Window**: Keep conversations focused and relevant
4. **Iterate and Refine**: Use feedback loops to improve outputs
5. **Consider Ethical Implications**: Be mindful of bias and potential harm

## The Future Outlook

Researchers are actively working on:
- Reducing hallucinations through better training methods
- Expanding context windows for longer interactions
- Improving reasoning capabilities
- Creating more efficient models
- Developing better evaluation metrics

Understanding these capabilities and limitations is crucial for effectively working with LLMs in any application.`,
        },
        {
          id: "ai-applications",
          moduleId: "ai-intro",
          title: "Real-World Applications",
          slug: "real-world-applications",
          type: "interactive",
          order: 4,
          estimatedMinutes: 15,
          objectives: [
            "Explore practical applications of LLMs",
            "Understand industry use cases",
            "Learn about implementation considerations",
          ],
          content: `# Real-World Applications of LLMs

## Industry Applications

### Software Development
- **Code Generation**: GitHub Copilot, Cursor, Replit
- **Code Review**: Automated PR reviews and suggestions
- **Documentation**: Generating and maintaining technical docs
- **Debugging**: Identifying and fixing bugs

### Content Creation
- **Marketing Copy**: Ad copy, social media posts, email campaigns
- **Technical Writing**: Reports, articles, whitepapers
- **Creative Writing**: Stories, scripts, dialogue
- **Translation and Localization**: Multi-language content

### Customer Service
- **Chatbots**: 24/7 customer support
- **Email Automation**: Response drafting and routing
- **Knowledge Base**: Q&A systems and FAQ generation
- **Sentiment Analysis**: Understanding customer feedback

### Education
- **Personalized Tutoring**: Adaptive learning systems
- **Content Generation**: Quiz and exercise creation
- **Language Learning**: Interactive conversation practice
- **Accessibility**: Text simplification and explanation

### Healthcare
- **Medical Documentation**: Clinical note generation
- **Research Assistance**: Literature review and summarization
- **Patient Communication**: Explaining medical terms
- **Mental Health**: Conversational support systems

### Legal and Finance
- **Contract Analysis**: Reviewing and summarizing legal documents
- **Compliance**: Regulatory requirement checking
- **Research**: Case law and precedent analysis
- **Report Generation**: Financial summaries and insights

## Implementation Considerations

### Choosing the Right Model
- **Task Requirements**: Match model capabilities to needs
- **Cost vs Performance**: Balance quality with budget
- **Latency Requirements**: Real-time vs batch processing
- **Privacy Concerns**: On-premise vs cloud deployment

### Integration Patterns
1. **API Integration**: Direct API calls to model providers
2. **Fine-Tuning**: Customizing models for specific domains
3. **RAG Systems**: Combining LLMs with knowledge bases
4. **Agent Systems**: Multi-step reasoning and tool use

### Success Metrics
- **Accuracy**: How often the model provides correct information
- **Relevance**: How well responses match user intent
- **Efficiency**: Time and cost per interaction
- **User Satisfaction**: Feedback and engagement metrics

## Interactive Exercise: Design Your Application

Think about a problem in your field that could benefit from LLM technology. Consider:

1. **What specific task would the LLM perform?**
2. **What data would it need access to?**
3. **How would users interact with it?**
4. **What are the success criteria?**
5. **What are potential risks or limitations?**

Example: A legal research assistant that:
- Takes natural language queries about case law
- Searches through a database of legal precedents
- Summarizes relevant cases
- Highlights key arguments and outcomes
- Provides citations for further reading

This exercise helps you think practically about LLM implementation!`,
        },
      ],
    },
    {
      id: "transformer-architecture",
      courseId: "ai-fundamentals",
      title: "Understanding Transformer Architecture",
      description:
        "Deep dive into the transformer architecture that powers modern LLMs",
      order: 2,
      estimatedMinutes: 120,
      lessons: [
        {
          id: "attention-mechanism",
          moduleId: "transformer-architecture",
          title: "The Attention Mechanism",
          slug: "attention-mechanism",
          type: "interactive",
          order: 1,
          estimatedMinutes: 40,
          objectives: [
            "Understand self-attention and multi-head attention",
            "Learn how attention weights are calculated",
            "Visualize attention patterns in practice",
          ],
          content: `# The Attention Mechanism

## Introduction to Attention

The attention mechanism is the core innovation that makes transformers powerful. It allows the model to focus on relevant parts of the input when processing each element.

## Self-Attention Explained

### The Key Insight
"Attention" allows every position in a sequence to attend to every other position. This creates rich representations that capture long-range dependencies.

### The Process

1. **Query, Key, Value Vectors**
   - Each input token is transformed into three vectors
   - Query (Q): What information am I looking for?
   - Key (K): What information do I contain?
   - Value (V): The actual information to pass along

2. **Attention Score Calculation**
   \`\`\`
   Attention(Q, K, V) = softmax(QK^T / √d_k)V
   \`\`\`
   - Compute dot product of Q with all K vectors
   - Scale by square root of dimension
   - Apply softmax to get weights
   - Multiply by V vectors

3. **Multi-Head Attention**
   - Run attention multiple times in parallel
   - Each "head" learns different relationships
   - Concatenate and transform results

## Visual Example

Consider the sentence: "The cat sat on the mat"

When processing "sat", the attention mechanism might:
- Strongly attend to "cat" (subject)
- Moderately attend to "mat" (location)
- Weakly attend to "the" (less relevant)

## Interactive Demo

\`\`\`python
import numpy as np

def attention(Q, K, V, d_k):
    """Simple attention calculation"""
    # Calculate attention scores
    scores = np.dot(Q, K.T) / np.sqrt(d_k)
    
    # Apply softmax
    weights = np.exp(scores) / np.sum(np.exp(scores))
    
    # Weighted sum of values
    output = np.dot(weights, V)
    
    return output, weights

# Example with 3 tokens
d_k = 4  # Dimension
Q = np.random.randn(1, d_k)  # Query for one token
K = np.random.randn(3, d_k)  # Keys for 3 tokens
V = np.random.randn(3, d_k)  # Values for 3 tokens

output, weights = attention(Q, K, V, d_k)
print(f"Attention weights: {weights}")
print(f"Output shape: {output.shape}")
\`\`\`

## Why Attention Works

1. **Parallelization**: Unlike RNNs, all positions can be processed simultaneously
2. **Long-Range Dependencies**: Direct connections between distant tokens
3. **Interpretability**: Attention weights show what the model focuses on
4. **Flexibility**: Can attend to different aspects through multiple heads

## Practical Implications

- **Context Understanding**: Models can reference earlier parts of a conversation
- **Translation**: Align words between languages
- **Summarization**: Identify key information to retain
- **Question Answering**: Focus on relevant context

Understanding attention is crucial for prompt engineering and debugging model behavior!`,
          exercise: {
            id: "attention-exercise",
            title: "Implement Simple Attention",
            description: "Code a basic attention mechanism",
            type: "code",
            difficulty: "medium",
            points: 20,
            content: {
              type: "code",
              prompt:
                "Implement a simplified attention function that takes query, key, and value matrices and returns attention output.",
              starterCode: `def simple_attention(query, key, value):
    """
    Implement a simple attention mechanism.
    
    Args:
        query: Shape (seq_len_q, d_model)
        key: Shape (seq_len_k, d_model)
        value: Shape (seq_len_v, d_model)
    
    Returns:
        output: Attention output
        weights: Attention weights for visualization
    """
    # TODO: Implement attention calculation
    # Step 1: Calculate scores (QK^T)
    # Step 2: Scale scores
    # Step 3: Apply softmax
    # Step 4: Apply weights to values
    
    pass`,
              language: "python",
              expectedOutput: "Attention output matrix and weights",
            },
          },
        },
      ],
    },
  ],
};
