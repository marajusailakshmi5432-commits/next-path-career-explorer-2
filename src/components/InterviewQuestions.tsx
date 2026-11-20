import { FileQuestion, Download, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { SectionHeader } from './SkillPicker';
import type { InterviewQuestion } from '@/types';

interface InterviewQuestionsProps {
  questions: InterviewQuestion[];
  targetName: string;
  targetType: 'role' | 'company';
}

export function InterviewQuestions({
  questions,
  targetName,
  targetType,
}: InterviewQuestionsProps) {
  if (!targetName) return null;

  const filtered = questions
    .filter((q) => q.target_name === targetName)
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 10);

  if (filtered.length === 0) return null;

  function handleDownloadPDF() {
    window.print();
  }

  const label = targetType === 'role' ? 'Role' : 'Company';

  return (
    <section className="animate-slide-up print-block">
      <SectionHeader
        step={0}
        title={`Top 10 Interview Questions — ${targetName}`}
        subtitle={`Expected questions and sample answers for this ${label.toLowerCase()}. Use the Download button to save as PDF.`}
      />

      <div className="mb-4 no-print">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-navy-900"
        >
          <Download className="h-4 w-4" />
          Download Interview Guide (PDF)
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((q, idx) => (
          <QuestionCard key={q.id} question={q} index={idx + 1} />
        ))}
      </div>
    </section>
  );
}

function QuestionCard({
  question,
  index,
}: {
  question: InterviewQuestion;
  index: number;
}) {
  return (
    <details className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <summary className="flex cursor-pointer items-center gap-3 p-4 text-left transition hover:bg-slate-50">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-sm font-bold text-teal-700">
          {index}
        </span>
        <span className="flex-1 text-sm font-semibold text-navy-900 sm:text-base">
          {question.question}
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition group-open:hidden" />
        <ChevronUp className="hidden h-5 w-5 shrink-0 text-slate-400 transition group-open:block" />
      </summary>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-2 flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-teal-600" />
          <span className="text-xs font-bold uppercase tracking-wide text-teal-600">
            Sample Answer
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          {question.sample_answer}
        </p>
      </div>
    </details>
  );
}

export function InterviewSectionWrapper({
  selectedRole,
  selectedCompany,
  questions,
}: {
  selectedRole: string | null;
  selectedCompany: { name: string } | null;
  questions: InterviewQuestion[];
}) {
  if (selectedRole) {
    return (
      <InterviewQuestions
        questions={questions}
        targetName={selectedRole}
        targetType="role"
      />
    );
  }

  if (selectedCompany) {
    return (
      <InterviewQuestions
        questions={questions}
        targetName={selectedCompany.name}
        targetType="company"
      />
    );
  }

  return (
    <section className="animate-fade-in">
      <SectionHeader
        step={0}
        title="Interview Questions & Guide"
        subtitle="Select a role or company above to see the Top 10 expected questions with sample answers."
      />
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <FileQuestion className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-3 text-sm text-slate-400">
          Tap a job role or search a company to load interview questions.
        </p>
      </div>
    </section>
  );
}
