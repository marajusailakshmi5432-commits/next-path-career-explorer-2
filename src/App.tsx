import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { Footer } from '@/components/Footer';
import { SkillPicker } from '@/components/SkillPicker';
import { RoleExplorer } from '@/components/RoleExplorer';
import { CompanyPrep } from '@/components/CompanyPrep';
import { ATSChecker } from '@/components/ATSChecker';

const GENERAL_SKILLS = [
  'Communication', 'MS Excel', 'Problem Solving', 'Customer Support',
  'Teamwork', 'Time Management', 'Python', 'SQL', 'Leadership',
  'English', 'Aptitude', 'Reasoning',
];

export default function App() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [savedRoles, setSavedRoles] = useState<string[]>([]);
  const [degreePicked, setDegreePicked] = useState(false);

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

  function handleSelectDegree(_name: string) {
    setDegreePicked(true);
  }

  function handleSaveRole(name: string) {
    setSavedRoles((prev) =>
      prev.includes(name) ? prev : [...prev, name]
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Hero
        degrees={[]}
        selectedDegree=""
        onSelectDegree={handleSelectDegree}
        onAddCustomDegree={handleSelectDegree}
      />

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-12 lg:py-14">
        <SkillPicker
          availableSkills={GENERAL_SKILLS}
          selectedSkills={selectedSkills}
          customSkills={customSkills}
          onToggle={toggleSkill}
          onAddCustom={addCustomSkill}
          onRemoveCustom={removeCustomSkill}
        />

        <RoleExplorer
          selectedSkills={selectedSkills}
          savedRoles={savedRoles}
          onSaveRole={handleSaveRole}
        />

        <CompanyPrep selectedSkills={selectedSkills} />

        <ATSChecker />
      </main>

      <Footer />
    </div>
  );
}
