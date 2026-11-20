import { useState } from 'react';
import {
  Search, Building2, Layers, Lightbulb, Check, X,
  Briefcase, Cpu, Factory, HeartPulse, Landmark, ShoppingBag, XCircle,
} from 'lucide-react';
import { SectionHeader } from './SkillPicker';
import type { Company, CompanyDetails } from '@/types';

interface CompanySearchProps {
  companies: Company[];
  selectedSkills: string[];
  selectedCompany: CompanyDetails | null;
  onSelectCompany: (company: CompanyDetails | null) => void;
}

const SECTOR_STYLES: Record<string, { color: string; bg: string; ring: string; hover: string; icon: typeof Cpu }> = {
  IT: { color: 'text-indigo-700', bg: 'bg-indigo-50', ring: 'ring-indigo-200', hover: 'hover:bg-indigo-100', icon: Cpu },
  Core: { color: 'text-slate-700', bg: 'bg-slate-100', ring: 'ring-slate-200', hover: 'hover:bg-slate-200', icon: Factory },
  Finance: { color: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-200', hover: 'hover:bg-emerald-100', icon: Landmark },
  Healthcare: { color: 'text-rose-700', bg: 'bg-rose-50', ring: 'ring-rose-200', hover: 'hover:bg-rose-100', icon: HeartPulse },
  Retail: { color: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-200', hover: 'hover:bg-amber-100', icon: ShoppingBag },
  Government: { color: 'text-blue-800', bg: 'bg-blue-50', ring: 'ring-blue-200', hover: 'hover:bg-blue-100', icon: Building2 },
};

function getSectorStyle(sector: string) {
  return SECTOR_STYLES[sector] ?? SECTOR_STYLES.Core;
}

export function CompanySearch({
  companies,
  selectedSkills,
  selectedCompany,
  onSelectCompany,
}: CompanySearchProps) {
  const [query, setQuery] = useState('');

  function search(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const found = companies.find(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (found) {
      onSelectCompany({
        name: found.name,
        about: found.about,
        roles_available: found.roles_available,
        hiring_rounds: found.hiring_rounds,
        prep_tip: found.prep_tip,
        sector: found.sector,
        isCustom: false,
      });
    } else {
      onSelectCompany(generateFallback(trimmed));
    }
  }

  function generateFallback(name: string): CompanyDetails {
    return {
      name,
      about: `${name} hires for a mix of IT and Non-IT roles. While specific details are not available, most companies follow a similar hiring process for entry-level positions.`,
      roles_available: ['Operations Executive', 'Customer Support Executive', 'Data Analyst', 'Sales & Marketing Executive'],
      hiring_rounds: ['Aptitude Test', 'Personal Interview', 'HR Round'],
      prep_tip: 'Research the company on their website, practice common interview questions, and be ready to talk about your skills and projects confidently.',
      sector: 'General',
      isCustom: true,
    };
  }

  return (
    <section className="animate-slide-up">
      <SectionHeader
        step={3}
        title="Explore Companies"
        subtitle="Search any company or tap a name to see hiring details and interview questions."
      />

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search(query)}
              placeholder="Search any company name..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
          </div>
          <button
            onClick={() => search(query)}
            disabled={!query.trim()}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {companies.map((c) => {
            const style = getSectorStyle(c.sector);
            const Icon = style.icon;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setQuery(c.name);
                  search(c.name);
                }}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition active:scale-95 ${
                  selectedCompany?.name === c.name
                    ? 'bg-navy-800 text-white shadow-sm'
                    : `${style.bg} ${style.color} ring-1 ${style.ring} ${style.hover}`
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.name}
              </button>
            );
          })}
        </div>

        {selectedCompany && (
          <CompanyCard
            company={selectedCompany}
            selectedSkills={selectedSkills}
            onClear={() => {
              onSelectCompany(null);
              setQuery('');
            }}
          />
        )}
      </div>
    </section>
  );
}

function CompanyCard({
  company,
  selectedSkills,
  onClear,
}: {
  company: CompanyDetails;
  selectedSkills: string[];
  onClear: () => void;
}) {
  const style = getSectorStyle(company.sector);

  return (
    <div className="mt-5 animate-slide-up overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-2.5">
          <Building2 className="h-5 w-5 text-navy-700" />
          <h3 className="text-lg font-bold text-navy-900">{company.name}</h3>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.bg} ${style.color}`}>
            {company.sector}
          </span>
          {company.isCustom && (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
              General Info
            </span>
          )}
        </div>
        <button
          onClick={onClear}
          className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 no-print"
        >
          Clear
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-sm leading-relaxed text-slate-600">
            {company.about}
          </p>
        </div>

        <InfoRow icon={Briefcase} label="Roles Available">
          <div className="flex flex-wrap gap-1.5">
            {company.roles_available.map((role) => (
              <span
                key={role}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-navy-800"
              >
                {role}
              </span>
            ))}
          </div>
        </InfoRow>

        <InfoRow icon={Layers} label="Hiring Process Steps">
          <div className="flex flex-wrap gap-1.5">
            {company.hiring_rounds.map((round, i) => (
              <span
                key={round}
                className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-200"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                {round}
              </span>
            ))}
          </div>
        </InfoRow>

        <InfoRow icon={Lightbulb} label="Easy Tips to Get Selected">
          <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-100">
            {company.prep_tip}
          </p>
        </InfoRow>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Layers;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon className="h-4 w-4 text-teal-600" />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      {children}
    </div>
  );
}
