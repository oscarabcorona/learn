import { courses } from "@/lib/course-data";
import { CourseCard } from "@/components/course/course-card";

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Courses</h1>
        <p className="text-lg text-muted-foreground">
          Choose from our comprehensive curriculum covering all aspects of AI
          and LLM engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
