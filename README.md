# AI/LLM Engineering Learning Platform

An open-source, interactive learning platform for mastering AI and LLM engineering. Built with Next.js, TypeScript, and modern web technologies.

## 🎯 Project Overview

This platform provides comprehensive, hands-on learning paths for AI/LLM engineering, from fundamentals to production deployment. No authentication required - just open and learn!

## 🏗️ Architecture Principles

### SOLID Principles

1. **Single Responsibility Principle (SRP)**
   - Each service class has one reason to change
   - `CourseService`: Manages course content only
   - `ProgressService`: Handles progress tracking only
   - `ExerciseService`: Validates exercises only
   - Components are focused on single UI concerns

2. **Open/Closed Principle (OCP)**
   - Services are open for extension, closed for modification
   - New course types can be added without changing core logic
   - Exercise validators can be extended via strategy pattern

3. **Liskov Substitution Principle (LSP)**
   - All service implementations follow consistent interfaces
   - Storage adapters (localStorage, sessionStorage) are interchangeable

4. **Interface Segregation Principle (ISP)**
   - Narrow, focused interfaces for each service
   - Components depend only on the methods they use
   - No "god" interfaces with unnecessary methods

5. **Dependency Inversion Principle (DIP)**
   - High-level modules don't depend on low-level modules
   - Both depend on abstractions (interfaces)
   - Storage and API implementations are injected

### DRY (Don't Repeat Yourself) Principle

- **Shared utilities**: Common functions in `/lib/utils`
- **Reusable components**: UI components in `/components/ui`
- **Centralized types**: TypeScript definitions in `/types`
- **Single source of truth**: Course data in `/lib/course-data`
- **Abstracted services**: Business logic in `/lib/services`

## 📚 Learning Paths

1. **AI Fundamentals** - Core concepts, transformers, and API basics
2. **Prompt Engineering** - Systematic prompt design and optimization
3. **RAG Systems** - Building retrieval-augmented generation systems
4. **Agent Development** - Creating autonomous AI agents
5. **Fine-tuning & Training** - Model customization techniques
6. **Production & Scaling** - Deployment and optimization strategies

## 🚀 Features

- ✅ **No Authentication Required** - Open learning for everyone
- ✅ **Interactive Code Playground** - Test prompts with your API key
- ✅ **Hands-on Exercises** - Practice with real-world scenarios
- ✅ **Progress Tracking** - Local storage persistence
- ✅ **Responsive Design** - Learn on any device
- ✅ **Dark/Light Mode** - Comfortable learning experience
- ✅ **Offline Capable** - Learn without constant internet
- ✅ **Export Progress** - Take your learning data with you

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Code Editor**: Monaco Editor
- **API Integration**: Anthropic Claude SDK
- **Animations**: Framer Motion
- **Markdown**: react-markdown with remark

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-learning-platform.git
cd ai-learning-platform

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start
```

## 🏃‍♂️ Development

```bash
# Run development server with Turbopack
pnpm dev

# Run linting
pnpm lint

# Format code
pnpm format

# Build for production
pnpm build
```

## 📁 Project Structure

```
src/
├── app/                # Next.js App Router pages
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── course/        # Course-specific components
│   ├── exercise/      # Exercise components
│   └── playground/    # API playground components
├── lib/               # Core utilities and services
│   ├── services/      # Business logic (SOLID)
│   ├── course-data/   # Course content
│   └── validation/    # Zod schemas
├── stores/            # Zustand state management
├── types/             # TypeScript definitions
└── hooks/             # Custom React hooks
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Adding new course content
- Creating exercises
- Improving UI/UX
- Fixing bugs
- Adding features

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Powered by [Anthropic Claude](https://anthropic.com)

## 🔗 Links

- [Documentation](https://docs.example.com)
- [Discord Community](https://discord.gg/example)
- [Report Issues](https://github.com/yourusername/ai-learning-platform/issues)

---

**Happy Learning!** 🚀 Start your AI engineering journey today.