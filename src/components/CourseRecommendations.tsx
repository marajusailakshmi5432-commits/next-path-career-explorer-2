import { GraduationCap, Clock, BarChart3, BookOpen } from 'lucide-react';
import { SectionHeader } from './SkillPicker';
import type { Course, Role, CompanyDetails } from '@/types';

interface CourseRecommendationsProps {
  courses: Course[];
  selectedSkills: string[];
  selectedRole: Role | null;
  selectedCompany: CompanyDetails | null;
}

export function CourseRecommendations({
  courses,
  selectedSkills,
  selectedRole,
  selectedCompany,
}: CourseRecommendationsProps) {
  const missingSkills = computeMissingSkills(
    selectedSkills,
    selectedRole,
    selectedCompany
  );

  const recommendations = pickTopCourses(courses, missingSkills, selectedSkills);

  return (
    <section className="animate-slide-up">
      <SectionHeader
        step={4}
        title="Best Beginner Learning Classes"
        subtitle="Easy step-by-step courses for the skills you still need."
      />

      {missingSkills.length > 0 ? (
        <div className="mb-4 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800 ring-1 ring-teal-100">
          <span className="font-semibold">Skills to build: </span>
          {missingSkills.slice(0, 6).join(', ')}
          {missingSkills.length > 6 && ` and ${missingSkills.length - 6} more`}
        </div>
      ) : (
        <div className="mb-4 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800 ring-1 ring-teal-100">
          You have all the key skills. These beginner courses will help you go deeper.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {recommendations.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}

function computeMissingSkills(
  selectedSkills: string[],
  role: Role | null,
  company: CompanyDetails | null
): string[] {
  const target = new Set<string>();
  if (role) role.skills.forEach((s) => target.add(s));
  if (company) company.roles_available.forEach((s) => target.add(s));
  if (target.size === 0) return [];

  return Array.from(target).filter(
    (s) =>
      !selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())
  );
}

function pickTopCourses(
  courses: Course[],
  missingSkills: string[],
  selectedSkills: string[]
): Course[] {
  const missingLower = missingSkills.map((s) => s.toLowerCase());
  const selectedLower = selectedSkills.map((s) => s.toLowerCase());

  const missingCourses = courses.filter((c) =>
    missingLower.includes(c.skill.toLowerCase())
  );

  const generalCourses = courses.filter(
    (c) => !selectedLower.includes(c.skill.toLowerCase())
  );

  const pool = [...missingCourses];
  for (const c of generalCourses) {
    if (pool.length >= 4) break;
    if (!pool.some((p) => p.id === c.id)) pool.push(c);
  }

  return pool.slice(0, 4);
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-teal-200 sm:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold leading-tight text-navy-900">
              {course.title}
            </h3>
            <p className="text-xs font-medium text-teal-600">{course.platform}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
            course.is_free
              ? 'bg-green-100 text-green-700 ring-green-200'
              : 'bg-orange-100 text-orange-700 ring-orange-200'
          }`}
        >
          {course.is_free ? 'FREE' : 'PAID'}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Tag icon={BookOpen} label={course.skill} />
        <Tag icon={BarChart3} label={course.difficulty} />
        <Tag icon={Clock} label={course.estimated_time} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {course.reason}
      </p>
    </div>
  );
}

function Tag({
  icon: Icon,
  label,
}: {
  icon: typeof Clock;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      <Icon className="h-3 w-3 text-slate-400" />
      {label}
    </span>
  );
}
