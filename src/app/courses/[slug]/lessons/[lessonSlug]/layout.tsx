import { notFound } from 'next/navigation';
import { courseService } from '@/lib/services';
import { LessonSidebar } from '@/components/course/lesson-sidebar';

interface LessonLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

export default async function LessonLayout({ children, params }: LessonLayoutProps) {
  const { slug, lessonSlug } = await params;
  const course = courseService.getCourseBySlug(slug);
  const lesson = course ? courseService.getLessonBySlug(slug, lessonSlug) : undefined;

  if (!course || !lesson) {
    notFound();
  }

  return (
    <div className="flex h-full -m-6">
      <LessonSidebar course={course} currentLessonId={lesson.id} />
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
}