'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Circle,
  BookOpen,
  Code,
  Video,
  ChevronLeft
} from 'lucide-react';
import type { Course, Module, Lesson } from '@/types';
import { useProgressStore } from '@/stores';

interface LessonSidebarProps {
  course: Course;
  currentLessonId?: string;
}

export function LessonSidebar({ course, currentLessonId }: LessonSidebarProps) {
  const pathname = usePathname();
  const { userProgress } = useProgressStore();
  
  const courseProgress = userProgress?.courses.find(c => c.courseId === course.id);

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'reading':
        return BookOpen;
      case 'video':
        return Video;
      case 'interactive':
      case 'exercise':
        return Code;
      default:
        return BookOpen;
    }
  };

  const isLessonCompleted = (moduleId: string, lessonId: string) => {
    const moduleProgress = courseProgress?.modules.find(m => m.moduleId === moduleId);
    const lessonProgress = moduleProgress?.lessons.find(l => l.lessonId === lessonId);
    return !!lessonProgress?.completedAt;
  };

  const isLessonActive = (lesson: Lesson) => {
    return pathname.includes(lesson.slug) || lesson.id === currentLessonId;
  };

  return (
    <div className="flex h-full w-80 flex-col border-r bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-2 -ml-2"
        >
          <Link href={`/courses/${course.slug}`}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
        <h3 className="font-semibold text-sm">{course.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {course.modules.length} modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
        </p>
      </div>

      {/* Lesson List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {course.modules.map((module) => (
            <div key={module.id}>
              <h4 className="font-medium text-xs uppercase text-muted-foreground mb-2">
                Module {module.order}
              </h4>
              <p className="text-sm font-medium mb-3">{module.title}</p>
              
              <div className="space-y-1">
                {module.lessons.map((lesson, lessonIndex) => {
                  const LessonIcon = getLessonIcon(lesson.type);
                  const isCompleted = isLessonCompleted(module.id, lesson.id);
                  const isActive = isLessonActive(lesson);
                  const isCurrentLesson = lesson.id === currentLessonId;

                  return (
                    <Button
                      key={lesson.id}
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      asChild
                      className={cn(
                        'w-full justify-start h-auto py-2 px-2',
                        isActive && 'bg-secondary',
                        isCurrentLesson && 'ring-2 ring-primary'
                      )}
                    >
                      <Link href={`/courses/${course.slug}/lessons/${lesson.slug}`}>
                        <div className="flex items-start gap-2 w-full">
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          )}
                          
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-1">
                              <LessonIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Lesson {lessonIndex + 1}
                              </span>
                            </div>
                            <p className="text-sm font-normal line-clamp-2">
                              {lesson.title}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {lesson.estimatedMinutes} min
                            </span>
                          </div>
                        </div>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Progress Summary */}
      {courseProgress && (
        <div className="border-t p-4">
          <div className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="font-medium">
                {Math.round(courseProgress.completionPercentage)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${courseProgress.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}