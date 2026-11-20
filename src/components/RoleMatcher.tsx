import { Check, X, Target, GraduationCap, IndianRupee, Cpu, Briefcase } from 'lucide-react';
import { SectionHeader } from './SkillPicker';
import { getRoleIcon } from '@/lib/iconMap';
import type { Role } from '@/types';

interface RoleMatcherProps {
  roles: Role[];
  selectedSkills: string[];
  selectedRole: string | null;
  onSelectRole: (name: string) => void;
  selectedDegree: string;
  isCustomDegree: boolean;
}

export function RoleMatcher({
  roles,
  selectedSkills,
  selectedRole,
  onSelectRole,
  selectedDegree,
  isCustomDegree,
}: RoleMatcherProps) {
  if (!selectedDegree) {
    return (
      <section className="animate-fade-in">
        <SectionHeader
          step={2}
          title="Best Job Roles For You"
          subtitle="Enter your degree above to see matching jobs."
        />
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <Target className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-400">
            Search your degree at the top to see roles that fit you.
          </p>
        </div>
      </section>
    );
  }

  if (selectedSkills.length === 0) {
    return (
      <section className="animate-fade-in">
        <SectionHeader
          step={2}
          title="Best Job Roles For You"
          subtitle="Pick your skills above to see jobs that match."
        />
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <Target className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-400">
            Select at least one skill to see matching job roles.
          </p>
        </div>
      </section>
    );
  }

  const filtered = isCustomDegree
    ? roles
    : roles.filter((r) => r.degrees.includes(selectedDegree));

  const ranked = filtered
    .map((role) => {
      const matched = role.skills.filter((s) =>
        selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())
      );
      const score = Math.round((matched.length / role.skills.length) * 100);
      return { role, matched, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <section className="animate-slide-up">
      <SectionHeader
        step={2}
        title="Best Job Roles For You"
        subtitle="Ranked by how well your skills match. Tap a role to see its interview questions."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map(({ role, matched, score }) => {
          const Icon = getRoleIcon(role.icon);
          const isSelected = selectedRole === role.name;
          const missing = role.skills.filter((s) => !matched.includes(s));

          return (
            <button
              key={role.id}
              onClick={() => onSelectRole(isSelected ? '' : role.name)}
              className={`flex flex-col overflow-hidden rounded-2xl bg-white p-5 text-left shadow-sm transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-teal-500 shadow-lg shadow-teal-100'
                  : 'ring-1 ring-slate-200 hover:ring-teal-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isSelected
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-slate-100 text-navy-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-navy-900">
                      {role.name}
                    </h3>
                    <span className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      role.role_type === 'IT'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {role.role_type === 'IT' ? (
                        <Cpu className="h-2.5 w-2.5" />
                      ) : (
                        <Briefcase className="h-2.5 w-2.5" />
                      )}
                      {role.role_type}
                    </span>
                  </div>
                  <ScoreBadge score={score} />
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {role.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {matched.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-200"
                  >
                    <Check className="h-3 w-3" />
                    {s}
                  </span>
                ))}
                {missing.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-slate-200"
                  >
                    <X className="h-3 w-3" />
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2">
                  <GraduationCap className="h-4 w-4 shrink-0 text-navy-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Eligible Degrees</p>
                    <p className="text-sm text-slate-700">{role.degrees.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <IndianRupee className="h-4 w-4 shrink-0 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Starting Salary</p>
                    <p className="text-sm font-semibold text-teal-700">{role.salary_lpa}</p>
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 border-t border-teal-100 pt-2 text-xs font-medium text-teal-600">
                  Selected — interview questions and courses focus on this role.
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ScoreBadge({ score }: { score: number }) {
  let color = 'bg-slate-100 text-slate-600 ring-slate-200';
  if (score >= 70) color = 'bg-teal-100 text-teal-700 ring-teal-200';
  else if (score >= 40) color = 'bg-amber-100 text-amber-700 ring-amber-200';

  return (
    <span
      className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${color}`}
    >
      <Target className="h-3 w-3" />
      {score}% Match
    </span>
  );
}
