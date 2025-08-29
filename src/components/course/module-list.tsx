'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Circle,
  PlayCircle,
  BookOpen,
  Code,
  Video,
  Lock
} from 'lucide-react';
import type { Course, Module, Lesson } from '@/types';
import { useProgressStore } from '@/stores';

interface ModuleListProps {
  course: Course;
}

export function ModuleList({ course }: ModuleListProps) {
  const router = useRouter();
  const { userProgress } = useProgressStore();
  const [expandedModules, setExpandedModules] = useState<string[]>([course.modules[0]?.id || '']);
  
  const courseProgress = userProgress?.courses.find(c => c.courseId === course.id);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

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

  const isModuleLocked = (moduleIndex: number) => {
    if (moduleIndex === 0) return false;
    
    // Check if previous module is completed
    const previousModule = course.modules[moduleIndex - 1];
    const previousModuleProgress = courseProgress?.modules.find(
      m => m.moduleId === previousModule.id
    );
    
    return !previousModuleProgress?.completedAt;
  };

  const getModuleProgress = (moduleId: string) => {
    const moduleProgress = courseProgress?.modules.find(m => m.moduleId === moduleId);
    return moduleProgress?.completionPercentage || 0;
  };

  const isLessonCompleted = (moduleId: string, lessonId: string) => {
    const moduleProgress = courseProgress?.modules.find(m => m.moduleId === moduleId);
    const lessonProgress = moduleProgress?.lessons.find(l => l.lessonId === lessonId);
    return !!lessonProgress?.completedAt;
  };

  const handleLessonClick = (lesson: Lesson, moduleIndex: number) => {
    if (isModuleLocked(moduleIndex)) return;
    router.push(`/courses/${course.slug}/lessons/${lesson.slug}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Course Content</h2>
        <p className="text-sm text-muted-foreground">
          {course.modules.length} modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
        </p>
      </div>

      {course.modules.map((module, moduleIndex) => {
        const isExpanded = expandedModules.includes(module.id);
        const isLocked = isModuleLocked(moduleIndex);
        const moduleProgress = getModuleProgress(module.id);
        const completedLessons = module.lessons.filter(lesson => 
          isLessonCompleted(module.id, lesson.id)
        ).length;

        return (
          <Card key={module.id} className={isLocked ? 'opacity-60' : ''}>
            <CardHeader className="cursor-pointer" onClick={() => !isLocked && toggleModule(module.id)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 mt-0.5"
                    disabled={isLocked}
                  >
                    {isLocked ? (
                      <Lock className="h-4 w-4" />
                    ) : isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        Module {module.order}: {module.title}
                      </CardTitle>
                      {moduleProgress === 100 && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{module.estimatedMinutes} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{module.lessons.length} lessons</span>
                      </div>
                      {completedLessons > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {completedLessons}/{module.lessons.length} completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {moduleProgress > 0 && (
                <div className="mt-3 ml-9">
                  <Progress value={moduleProgress} className="h-1" />
                </div>
              )}
            </CardHeader>

            <Collapsible open={isExpanded && !isLocked}>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-2 ml-9">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const LessonIcon = getLessonIcon(lesson.type);
                      const isCompleted = isLessonCompleted(module.id, lesson.id);
                      const isFirstUncompletedLesson = !isCompleted && 
                        module.lessons.slice(0, lessonIndex).every(l => 
                          isLessonCompleted(module.id, l.id)
                        );

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson, moduleIndex)}
                          className={`
                            flex items-center justify-between p-3 rounded-lg border 
                            ${isLocked ? 'cursor-not-allowed bg-muted/30' : 'cursor-pointer hover:bg-accent/50'} 
                            ${isFirstUncompletedLesson ? 'border-primary bg-primary/5' : ''}
                            transition-colors
                          `}
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                            
                            <LessonIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            
                            <div className="space-y-1">
                              <p className="font-medium text-sm">{lesson.title}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{lesson.estimatedMinutes} min</span>
                                <Badge variant="outline" className="text-xs">
                                  {lesson.type}
                                </Badge>
                                {lesson.exercise && (
                                  <Badge variant="secondary" className="text-xs">
                                    Has Exercise
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {isFirstUncompletedLesson && !isLocked && (
                            <Button size="sm" variant="ghost">
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}