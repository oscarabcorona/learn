'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  BookOpen, 
  Trophy, 
  Target, 
  PlayCircle,
  CheckCircle2,
  Users,
  ChevronRight
} from 'lucide-react';
import type { Course } from '@/types';
import { useProgressStore } from '@/stores';
import { courseService } from '@/lib/services';

interface CourseOverviewProps {
  course: Course;
}

export function CourseOverview({ course }: CourseOverviewProps) {
  const router = useRouter();
  const { userProgress, startCourse } = useProgressStore();
  
  const courseProgress = userProgress?.courses.find(c => c.courseId === course.id);
  const completionPercentage = courseProgress?.completionPercentage || 0;
  const isStarted = !!courseProgress;
  const isCompleted = courseProgress?.completedAt;

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = courseProgress?.modules.reduce((acc, module) => {
    return acc + module.lessons.filter(l => l.completedAt).length;
  }, 0) || 0;

  const handleStartCourse = () => {
    if (!isStarted) {
      startCourse(course.id);
    }
    // Navigate to first lesson
    const firstLesson = course.modules[0]?.lessons[0];
    if (firstLesson) {
      router.push(`/courses/${course.slug}/lessons/${firstLesson.slug}`);
    }
  };

  const prerequisiteCourses = course.prerequisites?.map(prereqId => 
    courseService.getCourseById(prereqId)
  ).filter(Boolean) || [];

  const difficultyColors = {
    beginner: 'bg-green-500/10 text-green-600 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-8">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <Badge 
                  variant="outline" 
                  className={difficultyColors[course.difficulty]}
                >
                  {course.difficulty}
                </Badge>
                {isCompleted && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold">{course.title}</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {course.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.estimatedHours} hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>

              <div className="pt-4">
                <Button size="lg" onClick={handleStartCourse}>
                  {isStarted ? (
                    <>
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Continue Learning
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Start Course
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      {isStarted && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Completion</span>
                <span className="font-medium">{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold">{completedLessons}</p>
                <p className="text-xs text-muted-foreground">Lessons Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{totalLessons - completedLessons}</p>
                <p className="text-xs text-muted-foreground">Lessons Remaining</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {courseProgress?.totalTimeSpent ? Math.round(courseProgress.totalTimeSpent / 60) : 0}h
                </p>
                <p className="text-xs text-muted-foreground">Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prerequisites */}
      {prerequisiteCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prerequisites</CardTitle>
            <CardDescription>
              Complete these courses first for the best learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prerequisiteCourses.map(prereq => {
                if (!prereq) return null;
                const prereqProgress = userProgress?.courses.find(c => c.courseId === prereq.id);
                const isPrereqCompleted = prereqProgress?.completedAt;
                
                return (
                  <div 
                    key={prereq.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/courses/${prereq.slug}`)}
                  >
                    <div className="flex items-center gap-3">
                      {isPrereqCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{prereq.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {prereq.estimatedHours} hours • {prereq.modules.length} modules
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* What You'll Learn */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What You'll Learn</CardTitle>
          <CardDescription>
            Key concepts and skills covered in this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {course.modules.flatMap(module => 
              module.lessons.flatMap(lesson => lesson.objectives)
            ).slice(0, 8).map((objective, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{objective}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}