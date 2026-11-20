import { Copy, Printer, Trash2, Check } from 'lucide-react';
import { useState } from 'react';
import type { Role, CompanyDetails, Course } from '@/types';

interface ActionBarProps {
  selectedSkills: string[];
  selectedRole: Role | null;
  selectedCompany: CompanyDetails | null;
  recommendedCourses: Course[];
  onClear: () => void;
}

export function ActionBar({
  selectedSkills,
  selectedRole,
  selectedCompany,
  recommendedCourses,
  onClear,
}: ActionBarProps) {
  const [copied, setCopied] = useState(false);
  const hasPlan = selectedSkills.length > 0 || selectedRole || selectedCompany;

  function buildPlanText(): string {
    const lines: string[] = [];
    lines.push('=== MY NEXPATH CAREER PLAN ===');
    lines.push('');

    lines.push(`SKILLS: ${selectedSkills.join(', ') || 'None selected'}`);
    lines.push('');

    if (selectedRole) {
      lines.push(`TARGET ROLE: ${selectedRole.name}`);
      lines.push(`What you do: ${selectedRole.description}`);
      lines.push(`Eligible degrees: ${selectedRole.degrees.join(', ')}`);
      lines.push(`Starting salary: ${selectedRole.salary_lpa}`);
      lines.push('');
    }

    if (selectedCompany) {
      lines.push(`COMPANY: ${selectedCompany.name}`);
      lines.push(`About: ${selectedCompany.about}`);
      lines.push(`Roles available: ${selectedCompany.roles_available.join(', ')}`);
      lines.push(`Hiring steps: ${selectedCompany.hiring_rounds.join(' -> ')}`);
      lines.push(`Prep tip: ${selectedCompany.prep_tip}`);
      lines.push('');
    }

    if (recommendedCourses.length > 0) {
      lines.push('RECOMMENDED CLASSES:');
      recommendedCourses.forEach((c, i) => {
        lines.push(
          `  ${i + 1}. ${c.title} - ${c.platform} (${c.is_free ? 'Free' : 'Paid'}, ${c.estimated_time})`
        );
        lines.push(`     ${c.reason}`);
      });
      lines.push('');
    }

    lines.push('Generated with NexPath');
    return lines.join('\n');
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildPlanText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="no-print flex flex-col gap-3 sm:flex-row sm:justify-center">
      <button
        onClick={handleCopy}
        disabled={!hasPlan}
        className="flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-teal-400" />
            Copied to Clipboard!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy My Career Plan
          </>
        )}
      </button>

      <button
        onClick={handlePrint}
        disabled={!hasPlan}
        className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Printer className="h-4 w-4" />
        Print Plan
      </button>

      <button
        onClick={onClear}
        disabled={!hasPlan}
        className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-600 ring-1 ring-slate-300 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Trash2 className="h-4 w-4" />
        Clear All
      </button>
    </div>
  );
}
