"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/course/course-card";
import {
  Brain,
  Rocket,
  Target,
  Sparkles,
  BookOpen,
  Code2,
  Users,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { courses } from "@/lib/course-data";
import { useProgressStore } from "@/stores";

export default function HomePage() {
  const { loadProgress, userProgress } = useProgressStore();

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const features = [
    {
      icon: Brain,
      title: "Comprehensive Curriculum",
      description: "From fundamentals to advanced topics in AI/LLM engineering",
    },
    {
      icon: Code2,
      title: "Hands-on Learning",
      description: "Practice with real code examples and interactive exercises",
    },
    {
      icon: Rocket,
      title: "Production Ready",
      description: "Learn best practices for deploying AI systems at scale",
    },
    {
      icon: Users,
      title: "Open Source",
      description: "Free and open for everyone to learn and contribute",
    },
  ];

  const learningPaths = [
    {
      title: "Beginner Path",
      description: "Start your AI journey",
      courses: ["ai-fundamentals", "prompt-engineering"],
      color: "bg-green-500/10 border-green-500/20",
    },
    {
      title: "Builder Path",
      description: "Build AI applications",
      courses: ["rag-systems", "agent-development"],
      color: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Expert Path",
      description: "Master advanced topics",
      courses: ["fine-tuning", "production-scaling"],
      color: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  const totalCourses = courses.length;
  const completedCourses =
    userProgress?.courses.filter((c) => c.completedAt).length || 0;
  const totalPoints = userProgress?.totalPoints || 0;
  const currentStreak = userProgress?.streak || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <Badge variant="secondary" className="px-4 py-1">
            <Sparkles className="mr-2 h-3 w-3" />
            Open Source Learning Platform
          </Badge>
        </div>

        <h1 className="text-5xl font-bold tracking-tight">
          Master AI & LLM Engineering
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn to build production-ready AI applications with hands-on
          exercises, real-world projects, and comprehensive learning paths.
        </p>

        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/courses">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/playground">
              Try Playground
              <Code2 className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      {userProgress && (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Courses Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedCourses}/{totalCourses}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                {totalPoints}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentStreak} days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userProgress.achievements.length}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-2">
                <CardHeader>
                  <Icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Learning Paths */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Learning Path</h2>
          <p className="text-muted-foreground">
            Structured paths to guide your AI engineering journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <Card key={path.title} className={`border-2 ${path.color}`}>
              <CardHeader>
                <CardTitle>{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {path.courses.map((courseId) => {
                  const course = courses.find((c) => c.id === courseId);
                  const isCompleted = userProgress?.courses.some(
                    (c) => c.courseId === courseId && c.completedAt,
                  );

                  return course ? (
                    <div key={courseId} className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className="text-sm">{course.title}</span>
                    </div>
                  ) : null;
                })}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/courses">
                    Start Path
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
          <p className="text-muted-foreground">
            Start with our most popular courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">
              View All Courses
              <BookOpen className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 space-y-6 border-t">
        <h2 className="text-3xl font-bold">Ready to Start Your AI Journey?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of learners mastering AI engineering. No sign-up
          required, completely free and open source.
        </p>
        <Button size="lg" asChild>
          <Link href="/courses/ai-fundamentals">
            Start with Fundamentals
            <Target className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
