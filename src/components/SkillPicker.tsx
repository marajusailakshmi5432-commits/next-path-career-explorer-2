import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

interface SkillPickerProps {
  availableSkills: string[];
  selectedSkills: string[];
  customSkills: string[];
  onToggle: (skill: string) => void;
  onAddCustom: (skill: string) => void;
  onRemoveCustom: (skill: string) => void;
}

export function SkillPicker({
  availableSkills,
  selectedSkills,
  customSkills,
  onToggle,
  onAddCustom,
  onRemoveCustom,
}: SkillPickerProps) {
  const [input, setInput] = useState('');

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    const exists =
      availableSkills.some((s) => s.toLowerCase() === lower) ||
      customSkills.some((s) => s.toLowerCase() === lower);
    if (exists) {
      setInput('');
      return;
    }
    onAddCustom(trimmed);
    onToggle(trimmed);
    setInput('');
  }

  return (
    <section className="animate-slide-up">
      <SectionHeader
        step={1}
        title="Pick Your Skills"
        subtitle="Tap the skills you already have. You can also type your own below."
      />

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {availableSkills.map((skill) => {
            const selected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => onToggle(skill)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                  selected
                    ? 'bg-navy-800 text-white shadow-md shadow-navy-900/30 ring-2 ring-teal-400'
                    : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200 hover:ring-slate-300'
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5 text-teal-400" />}
                {skill}
              </button>
            );
          })}

          {customSkills.map((skill) => {
            const selected = selectedSkills.includes(skill);
            return (
              <div
                key={skill}
                className={`flex items-center gap-1.5 rounded-full pl-4 pr-1.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  selected
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-200 ring-2 ring-teal-400'
                    : 'bg-teal-50 text-teal-700 ring-1 ring-teal-200'
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {skill}
                <button
                  onClick={() => onRemoveCustom(skill)}
                  className="ml-0.5 rounded-full p-1 transition hover:bg-black/10"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Type any skill and press Enter..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-teal-100 px-5 py-2.5 text-sm font-semibold text-teal-800 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {selectedSkills.length === 0
            ? 'Pick at least one skill to see matching jobs.'
            : `${selectedSkills.length} skill${selectedSkills.length > 1 ? 's' : ''} selected — scroll down to see your matches.`}
        </p>
      </div>
    </section>
  );
}

export function SectionHeader({
  step,
  title,
  subtitle,
}: {
  step: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2.5">
        {step > 0 && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-800 text-sm font-bold text-white">
            {step}
          </span>
        )}
        <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">{title}</h2>
      </div>
      <p className={`mt-1.5 text-sm text-slate-500 sm:text-base ${step > 0 ? 'pl-9' : ''}`}>
        {subtitle}
      </p>
    </div>
  );
}
