import { useState } from 'react';
import {
  Search, Plus, Bookmark, Check, X, Target, Calendar,
  ChevronDown, ChevronUp, HelpCircle, Briefcase, IndianRupee,
} from 'lucide-react';
import { SectionHeader } from './SkillPicker';
import { generateRole, getPopularRoles, ROLE_CATEGORY_TABS, type GeneratedRole } from '@/lib/autoGenerate';
import { getRoleIcon } from '@/lib/iconMap';

interface RoleExplorerProps {
  selectedSkills: string[];
  savedRoles: string[];
  onSaveRole: (name: string) => void;
}

export function RoleExplorer({ selectedSkills, savedRoles, onSaveRole }: RoleExplorerProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRole, setActiveRole] = useState<GeneratedRole | null>(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [customRoleName, setCustomRoleName] = useState('');

  function searchRole(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const role = generateRole(trimmed, selectedSkills);
    setActiveRole(role);
  }

  function handleAddRole() {
    const trimmed = customRoleName.trim();
    if (!trimmed) return;
    searchRole(trimmed);
    setCustomRoleName('');
    setShowAddRole(false);
  }

  const popularRoles = getPopularRoles(activeCategory);

  return (
    <div className="space-y-8">
      <section className="animate-slide-up">
        <SectionHeader
          step={0}
          title="Search Any Job Role"
          subtitle="Search any role in any category. New roles are auto-created with skills, readiness score, roadmap, and interview questions."
        />

        {/* Search bar */}
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchRole(query)}
                placeholder="Search Any Role..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-base text-navy-900 outline-none transition focus:border-navy-700 focus:ring-2 focus:ring-navy-200"
              />
            </div>
            <button
              onClick={() => searchRole(query)}
              disabled={!query.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              onClick={() => setShowAddRole(!showAddRole)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy-700 ring-1 ring-navy-300 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Add Your Own Role
            </button>
          </div>

          {/* Add custom role input */}
          {showAddRole && (
            <div className="mt-3 flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row">
              <input
                type="text"
                value={customRoleName}
                onChange={(e) => setCustomRoleName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
                placeholder="Enter the role name (e.g., Cloud Architect, Dental Hygienist)..."
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-200"
              />
              <button
                onClick={handleAddRole}
                disabled={!customRoleName.trim()}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Create Role
              </button>
            </div>
          )}

          {/* Category tabs */}
          <div className="mt-4 flex flex-wrap gap-2">
            {ROLE_CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  activeCategory === cat
                    ? 'bg-navy-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Popular role chips */}
          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold text-slate-500">Popular roles in this category:</p>
            <div className="flex flex-wrap gap-2">
              {popularRoles.map((roleName) => {
                const Icon = getRoleIcon(roleName);
                return (
                  <button
                    key={roleName}
                    onClick={() => {
                      setQuery(roleName);
                      searchRole(roleName);
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-sm text-navy-700 ring-1 ring-slate-200 transition hover:bg-navy-50 hover:ring-navy-300"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-navy-500" />
                    {roleName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Active role detail */}
      {activeRole && (
        <RoleDetailCard
          role={activeRole}
          selectedSkills={selectedSkills}
          isSaved={savedRoles.includes(activeRole.name)}
          onSave={() => onSaveRole(activeRole.name)}
        />
      )}
    </div>
  );
}

function RoleDetailCard({
  role,
  selectedSkills,
  isSaved,
  onSave,
}: {
  role: GeneratedRole;
  selectedSkills: string[];
  isSaved: boolean;
  onSave: () => void;
}) {
  const Icon = getRoleIcon(role.name);
  const matched = role.skills.filter((s) =>
    selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())
  );
  const missing = role.skills.filter((s) => !matched.includes(s));

  return (
    <section className="animate-slide-up">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100 text-navy-800" style={{ backgroundColor: '#eef2ff' }}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900">{role.name}</h3>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">{role.category}</span>
            </div>
          </div>
          <button
            onClick={onSave}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              isSaved
                ? 'bg-teal-600 text-white'
                : 'bg-navy-800 text-white hover:bg-navy-900'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            {isSaved ? 'Saved!' : 'Save This Role'}
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Description + Readiness + Salary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <ReadinessCircle percentage={role.readiness} />
            </div>
            <div className="sm:col-span-2 space-y-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">What you do in this job</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{role.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-teal-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">Starting Salary</p>
                  <p className="text-sm font-semibold text-teal-700">{role.salaryRange}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills breakdown */}
          <div>
            <h4 className="mb-2 text-sm font-bold text-navy-900">12 Skills for This Role</h4>
            <div className="grid gap-2 sm:grid-cols-3">
              <SkillGroup label="Technical (6)" skills={role.technicalSkills} matched={matched} />
              <SkillGroup label="Tools (3)" skills={role.tools} matched={matched} />
              <SkillGroup label="Soft Skills (3)" skills={role.softSkills} matched={matched} />
            </div>
          </div>

          {/* 4-Week Roadmap */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-900">
              <Calendar className="h-4 w-4 text-navy-600" />
              4-Week Roadmap to Get Ready
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {role.roadmap.map((week) => (
                <div key={week.week} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-navy-800 text-xs font-bold text-white">
                      {week.week}
                    </span>
                    <span className="text-xs font-bold text-navy-700">Week {week.week}</span>
                  </div>
                  <p className="mb-2 text-sm font-semibold text-navy-900">{week.title}</p>
                  <ul className="space-y-1">
                    {week.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal-500" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Interview Questions */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-900">
              <HelpCircle className="h-4 w-4 text-navy-600" />
              Top 5 Interview Questions
            </h4>
            <div className="space-y-2">
              {role.interviewQuestions.map((q, idx) => (
                <details key={idx} className="group overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                  <summary className="flex cursor-pointer items-center gap-3 p-3 text-left transition hover:bg-slate-50">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-xs font-bold text-teal-700">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-navy-900">{q.question}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 group-open:hidden" />
                    <ChevronUp className="hidden h-4 w-4 shrink-0 text-slate-400 group-open:block" />
                  </summary>
                  <div className="border-t border-slate-100 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-600">Sample Answer</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{q.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReadinessCircle({ percentage }: { percentage: number }) {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = percentage >= 70 ? '#0d9488' : percentage >= 40 ? '#d97706' : '#dc2626';

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle
            cx="45" cy="45" r={radius} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{percentage}%</span>
        </div>
      </div>
      <p className="mt-1 text-xs font-semibold text-slate-500">Readiness</p>
    </div>
  );
}

function SkillGroup({ label, skills, matched }: { label: string; skills: string[]; matched: string[] }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => {
          const has = matched.some((m) => m.toLowerCase() === s.toLowerCase());
          return (
            <span
              key={s}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                has ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-slate-100 text-slate-500 ring-slate-200'
              }`}
            >
              {has ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              {s}
            </span>
          );
        })}
      </div>
    </div>
  );
}
