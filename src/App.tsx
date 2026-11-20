import { useState, useMemo } from 'react';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { StepIndicator } from '@/components/StepIndicator';
import { SkillPicker, SectionHeader } from '@/components/SkillPicker';
import { RoleMatcher } from '@/components/RoleMatcher';
import { CompanySearch } from '@/components/CompanySearch';
import { CourseRecommendations } from '@/components/CourseRecommendations';
import { InterviewSectionWrapper } from '@/components/InterviewQuestions';
import { ActionBar } from '@/components/ActionBar';
import { useNexPathData } from '@/hooks/useNexPathData';
import type { CompanyDetails, Course, Degree } from '@/types';
import { AlertCircle, Loader2 } from 'lucide-react';

const GENERAL_SKILLS = ['Communication', 'MS Excel', 'Problem Solving', 'Customer Support', 'Teamwork', 'Time Management'];

export default function App() {
  const { degrees, roles, companies, courses, questions, loading, error } = useNexPathData();

  const [selectedDegree, setSelectedDegree] = useState('');
  const [customDegrees, setCustomDegrees] = useState<Degree[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [selectedRoleName, setSelectedRoleName] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);

  const allDegrees = useMemo(() => [...degrees, ...customDegrees], [degrees, customDegrees]);

  const currentDegree = useMemo(
    () => allDegrees.find((d) => d.name === selectedDegree) ?? null,
    [allDegrees, selectedDegree]
  );

  const isCustomDegree = useMemo(
    () => customDegrees.some((d) => d.name === selectedDegree),
    [customDegrees, selectedDegree]
  );

  const availableSkills = useMemo(() => {
    if (!currentDegree) return [];
    return currentDegree.skills;
  }, [currentDegree]);

  const selectedRole = useMemo(
    () => roles.find((r) => r.name === selectedRoleName) ?? null,
    [roles, selectedRoleName]
  );

  const recommendedCourses = useMemo<Course[]>(() => {
    return pickRecommendedCourses(
      courses,
      selectedSkills,
      selectedRole,
      selectedCompany
    );
  }, [courses, selectedSkills, selectedRole, selectedCompany]);

  const currentStep = computeCurrentStep(selectedDegree, selectedSkills, selectedRoleName, selectedCompany);

  function handleSelectDegree(name: string) {
    setSelectedDegree(name);
    setSelectedSkills([]);
    setCustomSkills([]);
    setSelectedRoleName(null);
    setSelectedCompany(null);
  }

  function handleAddCustomDegree(name: string) {
    setCustomDegrees((prev) => {
      if (prev.some((d) => d.name.toLowerCase() === name.toLowerCase())) return prev;
      return [
        ...prev,
        {
          id: `custom-${Date.now()}`,
          name,
          category: 'Custom',
          skills: GENERAL_SKILLS,
        },
      ];
    });
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  }

  function addCustomSkill(skill: string) {
    setCustomSkills((prev) => [...prev, skill]);
  }

  function removeCustomSkill(skill: string) {
    setCustomSkills((prev) => prev.filter((s) => s !== skill));
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  }

  function clearAll() {
    setSelectedSkills([]);
    setCustomSkills([]);
    setSelectedRoleName(null);
    setSelectedCompany(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Hero
        degrees={allDegrees}
        selectedDegree={selectedDegree}
        onSelectDegree={handleSelectDegree}
        onAddCustomDegree={handleAddCustomDegree}
      />

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-12 lg:py-14">
        <StepIndicator currentStep={currentStep} />

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            <p className="mt-3 text-sm">Loading your career explorer...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-red-50 py-12 text-center ring-1 ring-red-100">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <p className="mt-3 text-sm text-red-600">
              Something went wrong loading the data. Please try again.
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {selectedDegree && (
              <SkillPicker
                availableSkills={availableSkills}
                selectedSkills={selectedSkills}
                customSkills={customSkills}
                onToggle={toggleSkill}
                onAddCustom={addCustomSkill}
                onRemoveCustom={removeCustomSkill}
              />
            )}

            <RoleMatcher
              roles={roles}
              selectedSkills={selectedSkills}
              selectedRole={selectedRoleName}
              onSelectRole={(name) => setSelectedRoleName(name || null)}
              selectedDegree={selectedDegree}
              isCustomDegree={isCustomDegree}
            />

            <CompanySearch
              companies={companies}
              selectedSkills={selectedSkills}
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedCompany}
            />

            {(selectedRole || selectedCompany) && (
              <InterviewSectionWrapper
                selectedRole={selectedRoleName}
                selectedCompany={selectedCompany}
                questions={questions}
              />
            )}

            {(selectedRole || selectedCompany) && (
              <CourseRecommendations
                courses={courses}
                selectedSkills={selectedSkills}
                selectedRole={selectedRole}
                selectedCompany={selectedCompany}
              />
            )}

            {(selectedSkills.length > 0 || selectedRole || selectedCompany) && (
              <section className="animate-fade-in">
                <SectionHeader
                  step={0}
                  title="Your Career Plan"
                  subtitle="Save or share your personalized plan."
                />
                <ActionBar
                  selectedSkills={selectedSkills}
                  selectedRole={selectedRole}
                  selectedCompany={selectedCompany}
                  recommendedCourses={recommendedCourses}
                  onClear={clearAll}
                />
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function computeCurrentStep(
  degree: string,
  skills: string[],
  role: string | null,
  company: CompanyDetails | null
): number {
  if (company) return 4;
  if (role) return 4;
  if (skills.length > 0) return 2;
  if (degree) return 1;
  return 1;
}

function pickRecommendedCourses(
  courses: Course[],
  selectedSkills: string[],
  role: { skills: string[] } | null,
  company: CompanyDetails | null
): Course[] {
  const target = new Set<string>();
  if (role) role.skills.forEach((s) => target.add(s));
  if (company) company.roles_available.forEach((s) => target.add(s));
  if (target.size === 0) return [];

  const missing = Array.from(target).filter(
    (s) => !selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())
  );

  const missingLower = missing.map((s) => s.toLowerCase());
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
