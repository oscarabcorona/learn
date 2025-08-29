import { notFound } from 'next/navigation';
import { courseService } from '@/lib/services';
import { LessonViewer } from '@/components/course/lesson-viewer';

interface LessonPageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const course = courseService.getCourseBySlug(slug);
  const lesson = course ? courseService.getLessonBySlug(slug, lessonSlug) : undefined;
  
  if (!course || !lesson) {
    notFound();
  }

  // Find the module that contains this lesson
  const module = course.modules.find(m => 
    m.lessons.some(l => l.id === lesson.id)
  );

  if (!module) {
    notFound();
  }

  return <LessonViewer lesson={lesson} course={course} module={module} />;
}

export function generateStaticParams() {
  const courses = courseService.getAllCourses();
  const params: { slug: string; lessonSlug: string }[] = [];

  courses.forEach(course => {
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        params.push({
          slug: course.slug,
          lessonSlug: lesson.slug,
        });
      });
    });
  });

  return params;
}