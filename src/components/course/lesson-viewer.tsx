"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Circle,
  Clock,
  Target,
  BookOpen,
  Code,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Lesson, Course, Module } from "@/types";
import { useProgressStore } from "@/stores";
import { courseService } from "@/lib/services";

interface LessonViewerProps {
  lesson: Lesson;
  course: Course;
  module: Module;
}

export function LessonViewer({ lesson, course, module }: LessonViewerProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const { userProgress, startLesson, completeLesson } = useProgressStore();

  const lessonProgress = userProgress?.courses
    .find((c) => c.courseId === course.id)
    ?.modules.find((m) => m.moduleId === module.id)
    ?.lessons.find((l) => l.lessonId === lesson.id);

  useEffect(() => {
    // Start lesson if not already started
    if (!lessonProgress) {
      startLesson(course.id, module.id, lesson.id);
    }
    setIsCompleted(!!lessonProgress?.completedAt);
  }, [lesson.id, lessonProgress, startLesson, course.id, module.id]);

  const handleComplete = () => {
    completeLesson(course.id, module.id, lesson.id);
    setIsCompleted(true);
  };

  const nextLesson = courseService.getNextLesson(lesson.id);
  const previousLesson = courseService.getPreviousLesson(lesson.id);

  const typeIcons = {
    reading: BookOpen,
    interactive: Code,
    video: BookOpen,
    exercise: Code,
  };

  const TypeIcon = typeIcons[lesson.type];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TypeIcon className="h-5 w-5 text-muted-foreground" />
                <Badge variant="secondary">{lesson.type}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.estimatedMinutes} min</span>
                </div>
              </div>
              <CardTitle className="text-2xl">{lesson.title}</CardTitle>
            </div>
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {lesson.objectives.length > 0 && (
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Target className="h-4 w-4" />
                Learning Objectives
              </div>
              <ul className="space-y-1">
                {lesson.objectives.map((objective, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary mt-1">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;
                  
                  return !isInline ? (
                    <SyntaxHighlighter
                      language={match[1]}
                      style={oneDark}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>

          {lesson.resources && lesson.resources.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">
                Additional Resources
              </h3>
              <div className="space-y-2">
                {lesson.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <span>📎</span>
                    <span>{resource.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {resource.type}
                    </Badge>
                  </a>
                ))}
              </div>
            </div>
          )}

          {lesson.exercise && (
            <Tabs defaultValue="exercise" className="border-t pt-6">
              <TabsList>
                <TabsTrigger value="exercise">Exercise</TabsTrigger>
                <TabsTrigger value="hints">Hints</TabsTrigger>
              </TabsList>
              <TabsContent value="exercise" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {lesson.exercise.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lesson.exercise.description}
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  Start Exercise
                </Button>
              </TabsContent>
              <TabsContent value="hints" className="space-y-2">
                {lesson.exercise.hints?.map((hint, index) => (
                  <div
                    key={index}
                    className="bg-secondary/50 rounded-lg p-3 text-sm"
                  >
                    <span className="font-medium">Hint {index + 1}:</span>{" "}
                    {hint}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={!previousLesson}
          asChild={!!previousLesson}
        >
          {previousLesson ? (
            <a href={`/courses/${course.slug}/lessons/${previousLesson.slug}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Lesson
            </a>
          ) : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Lesson
            </>
          )}
        </Button>

        {!isCompleted && (
          <Button onClick={handleComplete}>
            Mark as Complete
            <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        )}

        <Button variant="outline" disabled={!nextLesson} asChild={!!nextLesson}>
          {nextLesson ? (
            <a href={`/courses/${course.slug}/lessons/${nextLesson.slug}`}>
              Next Lesson
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          ) : (
            <>
              Next Lesson
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
