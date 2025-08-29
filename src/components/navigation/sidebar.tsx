"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Brain,
  MessageSquare,
  Database,
  Bot,
  Wrench,
  Rocket,
  Home,
  PlayCircle,
  Settings,
  BookOpen,
  Trophy,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/stores";

const courseIcons = {
  "ai-fundamentals": Brain,
  "prompt-engineering": MessageSquare,
  "rag-systems": Database,
  "agent-development": Bot,
  "fine-tuning": Wrench,
  "production-scaling": Rocket,
};

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Playground", href: "/playground", icon: PlayCircle },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Settings", href: "/settings", icon: Settings },
];

const courses = [
  {
    id: "ai-fundamentals",
    name: "AI Fundamentals",
    href: "/courses/ai-fundamentals",
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    href: "/courses/prompt-engineering",
  },
  { id: "rag-systems", name: "RAG Systems", href: "/courses/rag-systems" },
  {
    id: "agent-development",
    name: "Agent Development",
    href: "/courses/agent-development",
  },
  { id: "fine-tuning", name: "Fine-tuning", href: "/courses/fine-tuning" },
  {
    id: "production-scaling",
    name: "Production & Scaling",
    href: "/courses/production-scaling",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { userProgress } = useProgressStore();

  const getCourseProgress = (courseId: string) => {
    const courseProgress = userProgress?.courses.find(
      (c) => c.courseId === courseId,
    );
    return courseProgress?.completionPercentage || 0;
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">AI Learn</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-4 py-4">
          <div>
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </h2>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href && "bg-secondary",
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>

          <div>
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Learning Paths
            </h2>
            <nav className="space-y-1">
              {courses.map((course) => {
                const Icon = courseIcons[course.id as keyof typeof courseIcons];
                const progress = getCourseProgress(course.id);
                const isActive = pathname.startsWith(course.href);

                return (
                  <div key={course.id}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-secondary",
                      )}
                      asChild
                    >
                      <Link href={course.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        <span className="flex-1 text-left">{course.name}</span>
                      </Link>
                    </Button>
                    {progress > 0 && (
                      <div className="px-4 py-1">
                        <Progress value={progress} className="h-1" />
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Points</span>
            <span className="font-semibold">
              {userProgress?.totalPoints || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Streak</span>
            <span className="font-semibold">
              {userProgress?.streak || 0} days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
