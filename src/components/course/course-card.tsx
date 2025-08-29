"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, Users, Trophy, ArrowRight } from "lucide-react";
import type { Course } from "@/types";
import { useProgressStore } from "@/stores";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { userProgress } = useProgressStore();

  const courseProgress = userProgress?.courses.find(
    (c) => c.courseId === course.id,
  );
  const completionPercentage = courseProgress?.completionPercentage || 0;
  const isStarted = !!courseProgress;
  const isCompleted = courseProgress?.completedAt;

  const difficultyColors = {
    beginner: "bg-green-500/10 text-green-600 border-green-500/20",
    intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    advanced: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {course.description}
            </CardDescription>
          </div>
          {isCompleted && <Trophy className="h-5 w-5 text-yellow-500" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={difficultyColors[course.difficulty]}
          >
            {course.difficulty}
          </Badge>
          {course.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.estimatedHours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.modules.length} modules</span>
          </div>
        </div>

        {isStarted && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full group">
          <Link href={`/courses/${course.slug}`}>
            {isStarted ? "Continue Learning" : "Start Course"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
