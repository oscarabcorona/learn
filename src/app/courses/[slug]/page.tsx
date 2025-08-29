import { notFound } from 'next/navigation';
import { courseService } from '@/lib/services';
import { CourseOverview } from '@/components/course/course-overview';
import { ModuleList } from '@/components/course/module-list';

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = courseService.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <CourseOverview course={course} />
      <div className="mt-8">
        <ModuleList course={course} />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const courses = courseService.getAllCourses();
  return courses.map((course) => ({
    slug: course.slug,
  }));
}