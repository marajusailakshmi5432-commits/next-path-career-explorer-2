import { useState } from 'react';
import {
  Search, Plus, Download, Building2, MapPin, Globe, IndianRupee,
  Layers, Lightbulb, Check, Briefcase, FileText, HelpCircle,
  ChevronDown, ChevronUp, Calendar, X,
} from 'lucide-react';
import { SectionHeader } from './SkillPicker';
import {
  generateCompany, getPopularCompanies, COMPANY_CATEGORY_TABS,
  type GeneratedCompany,
} from '@/lib/autoGenerate';
import { downloadCompanyInterviewPDF } from '@/lib/pdfUtils';

interface CompanyPrepProps {
  selectedSkills: string[];
}

export function CompanyPrep({ selectedSkills }: CompanyPrepProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCompany, setActiveCompany] = useState<GeneratedCompany | null>(null);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [customQuestions, setCustomQuestions] = useState('');
  const [downloading, setDownloading] = useState(false);

  function searchCompany(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const company = generateCompany(trimmed);
    setActiveCompany(company);
  }

  function handleAddCompany() {
    const trimmed = customCompanyName.trim();
    if (!trimmed) return;
    const company = generateCompany(trimmed);
    if (customQuestions.trim()) {
      const userQs = customQuestions.split('\n').filter((q) => q.trim()).slice(0, 5);
      company.previousYearQuestions = [...userQs, ...company.previousYearQuestions.slice(0, 5)];
    }
    setActiveCompany(company);
    setCustomCompanyName('');
    setCustomQuestions('');
    setShowAddCompany(false);
  }

  async function handleDownloadPDF() {
    if (!activeCompany) return;
    setDownloading(true);
    try {
      await downloadCompanyInterviewPDF(activeCompany);
    } finally {
      setDownloading(false);
    }
  }

  const popularCompanies = getPopularCompanies(activeCategory);

  return (
    <div className="space-y-8">
      <section className="animate-slide-up">
        <SectionHeader
          step={0}
          title="Company Interview Prep"
          subtitle="Search any company, hospital, or organization. Get full interview prep with questions, previous year papers, and resume tips."
        />

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchCompany(query)}
                placeholder="Search Any Company / Hospital / Organization..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-base text-navy-900 outline-none transition focus:border-navy-700 focus:ring-2 focus:ring-navy-200"
              />
            </div>
            <button
              onClick={() => searchCompany(query)}
              disabled={!query.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              onClick={() => setShowAddCompany(!showAddCompany)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy-700 ring-1 ring-navy-300 transition hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              Add Your Own Company
            </button>
          </div>

          {/* Add custom company */}
          {showAddCompany && (
            <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3">
              <input
                type="text"
                value={customCompanyName}
                onChange={(e) => setCustomCompanyName(e.target.value)}
                placeholder="Enter company name..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-200"
              />
              <textarea
                value={customQuestions}
                onChange={(e) => setCustomQuestions(e.target.value)}
                placeholder="Enter interview questions you heard (one per line)..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-200"
              />
              <button
                onClick={handleAddCompany}
                disabled={!customCompanyName.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add Company
              </button>
            </div>
          )}

          {/* Category tabs */}
          <div className="mt-4 flex flex-wrap gap-2">
            {COMPANY_CATEGORY_TABS.map((cat) => (
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

          {/* Popular companies */}
          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold text-slate-500">Popular companies in this category:</p>
            <div className="flex flex-wrap gap-2">
              {popularCompanies.map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setQuery(name);
                    searchCompany(name);
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-sm text-navy-700 ring-1 ring-slate-200 transition hover:bg-navy-50 hover:ring-navy-300"
                >
                  <Building2 className="h-3.5 w-3.5 text-navy-500" />
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company detail */}
      {activeCompany && (
        <CompanyDetailCard
          company={activeCompany}
          selectedSkills={selectedSkills}
          onDownload={handleDownloadPDF}
          downloading={downloading}
        />
      )}
    </div>
  );
}

function CompanyDetailCard({
  company,
  selectedSkills,
  onDownload,
  downloading,
}: {
  company: GeneratedCompany;
  selectedSkills: string[];
  onDownload: () => void;
  downloading: boolean;
}) {
  return (
    <section className="animate-slide-up">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-100 text-navy-800" style={{ backgroundColor: '#eef2ff' }}>
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900">{company.name}</h3>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">{company.category}</span>
            </div>
          </div>
          <button
            onClick={onDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {downloading ? 'Generating PDF...' : 'Download Interview PDF'}
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* About + meta */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-sm leading-relaxed text-slate-700">{company.about}</p>
            </div>
            <MetaRow icon={Calendar} label="Founded" value={company.foundedYear} />
            <MetaRow icon={MapPin} label="Headquarters" value={company.hq} />
            <MetaRow icon={Globe} label="Website" value={company.website} />
            <MetaRow icon={IndianRupee} label="Salary Range" value={company.salaryRange} />
          </div>

          {/* Top 8 Skills */}
          <div>
            <h4 className="mb-2 text-sm font-bold text-navy-900">Top 8 Skills They Look For</h4>
            <div className="flex flex-wrap gap-1.5">
              {company.topSkills.map((skill) => {
                const has = selectedSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
                return (
                  <span
                    key={skill}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                      has ? 'bg-teal-50 text-teal-700 ring-teal-200' : 'bg-slate-100 text-slate-500 ring-slate-200'
                    }`}
                  >
                    {has ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 5-Step Hiring Process */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-navy-900">
              <Layers className="h-4 w-4 text-navy-600" />
              Full 5-Step Hiring Process
            </h4>
            <div className="flex flex-wrap gap-2">
              {company.hiringProcess.map((step, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 ring-1 ring-teal-200"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Top 15 Interview Questions */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-900">
              <HelpCircle className="h-4 w-4 text-navy-600" />
              Top 15 Interview Questions (8 Technical + 7 HR)
            </h4>
            <div className="space-y-2">
              {company.interviewQuestions.map((q, idx) => (
                <details key={idx} className="group overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                  <summary className="flex cursor-pointer items-center gap-3 p-3 text-left transition hover:bg-slate-50">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-xs font-bold text-teal-700">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-sm font-semibold text-navy-900">{q.question}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      q.type === 'Technical' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {q.type}
                    </span>
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

          {/* Previous Year Questions */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-navy-900">
              <FileText className="h-4 w-4 text-navy-600" />
              5 Previous Year Questions
            </h4>
            <div className="space-y-1.5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              {company.previousYearQuestions.map((q, i) => (
                <p key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-200 text-xs font-bold text-navy-700" style={{ backgroundColor: '#e0e7ff' }}>
                    {i + 1}
                  </span>
                  {q}
                </p>
              ))}
            </div>
          </div>

          {/* Resume Tips */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-navy-900">
              <Lightbulb className="h-4 w-4 text-navy-600" />
              3 Resume Tips for {company.name}
            </h4>
            <div className="space-y-2">
              {company.resumeTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-100">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">
                    {i + 1}
                  </span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-navy-600" />
      <div>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
        <p className="text-sm text-slate-700">{value}</p>
      </div>
    </div>
  );
}


