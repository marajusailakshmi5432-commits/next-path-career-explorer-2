import { useState, useRef } from 'react';
import {
  Upload, FileText, ClipboardPaste, ScanLine, Check, X,
  Lightbulb, AlertTriangle, Loader2,
} from 'lucide-react';
import { SectionHeader } from './SkillPicker';
import { analyzeResume, type ATSResult } from '@/lib/atsCheck';
import { downloadATSReportPDF } from '@/lib/pdfUtils';

export function ATSChecker() {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setFileName(file.name);

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setLoading(true);
      try {
        const text = await extractPdfText(file);
        setResumeText(text);
        runAnalysis(text);
      } catch {
        setError('Could not read this PDF. Try pasting your resume text instead.');
      } finally {
        setLoading(false);
      }
    } else if (file.type.startsWith('text/')) {
      const text = await file.text();
      setResumeText(text);
      runAnalysis(text);
    } else {
      setError('Please upload a PDF or text file.');
    }
  }

  async function extractPdfText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjs = await import('pdfjs-dist');
    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: { str?: string }) => item.str || '')
        .join(' ');
      fullText += pageText + ' ';
    }
    return fullText.trim();
  }

  function runAnalysis(text: string) {
    const trimmed = text.trim();
    if (trimmed.length < 20) {
      setError('Resume text is too short to analyze. Please paste more content.');
      setResult(null);
      return;
    }
    setError('');
    setResult(analyzeResume(trimmed));
  }

  function handleAnalyze() {
    runAnalysis(resumeText);
  }

  function handleClear() {
    setResumeText('');
    setResult(null);
    setFileName('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDownloadPDF() {
    if (!result) return;
    setDownloading(true);
    try {
      await downloadATSReportPDF({
        score: result.score,
        matchedSkills: result.matchedKeywords,
        missingKeywords: result.missingKeywords,
        tips: result.tips,
        targetRole: 'General',
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="animate-slide-up">
        <SectionHeader
          step={0}
          title="ATS Resume Score Checker"
          subtitle="Upload your resume PDF or paste your resume text to get an instant ATS compatibility score, missing keywords, and tips to improve."
        />

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          {/* Upload + Paste tabs */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Upload zone */}
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                <Upload className="h-4 w-4 text-navy-600" />
                Upload Resume PDF
              </p>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-teal-400 hover:bg-teal-50"
              >
                <FileText className="h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Click to upload PDF
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  We'll extract the text automatically
                </p>
                {fileName && (
                  <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-teal-700">
                    <Check className="h-3 w-3" />
                    {fileName}
                  </p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Paste zone */}
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                <ClipboardPaste className="h-4 w-4 text-navy-600" />
                Paste Resume Text
              </p>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your full resume text here..."
                rows={8}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!resumeText.trim() || loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ScanLine className="h-4 w-4" />
              )}
              {loading ? 'Scanning...' : 'Check ATS Score'}
            </button>
            {(resumeText || result) && (
              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-600 ring-1 ring-slate-300 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {result && (
        <ATSResultCard
          result={result}
          onDownload={handleDownloadPDF}
          downloading={downloading}
        />
      )}
    </div>
  );
}

function ATSResultCard({
  result,
  onDownload,
  downloading,
}: {
  result: ATSResult;
  onDownload: () => void;
  downloading: boolean;
}) {
  const { score, matchedKeywords, missingKeywords, tips } = result;
  const scoreColor = score >= 70 ? '#0d9488' : score >= 40 ? '#d97706' : '#dc2626';
  const scoreLabel = score >= 70 ? 'Good' : score >= 40 ? 'Needs Work' : 'Poor';

  return (
    <section className="animate-slide-up">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-white">
              <ScanLine className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900">Your ATS Score</h3>
              <span className="text-sm text-slate-500">{scoreLabel} compatibility</span>
            </div>
          </div>
          <button
            onClick={onDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-900 disabled:opacity-60"
          >
            <FileText className="h-4 w-4" />
            {downloading ? 'Generating...' : 'Download Report'}
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Score circle */}
          <div className="flex flex-col items-center sm:flex-row sm:gap-8">
            <ScoreCircle score={score} color={scoreColor} />
            <div className="mt-4 grid w-full grid-cols-2 gap-3 sm:mt-0">
              <StatBox
                icon={Check}
                label="Keywords Found"
                value={matchedKeywords.length}
                color="text-teal-600"
                bg="bg-teal-50"
              />
              <StatBox
                icon={X}
                label="Keywords Missing"
                value={missingKeywords.length}
                color="text-amber-600"
                bg="bg-amber-50"
              />
            </div>
          </div>

          {/* Matched keywords */}
          {matchedKeywords.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-navy-900">
                <Check className="h-4 w-4 text-teal-600" />
                Keywords Found in Resume
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 ring-1 ring-teal-200"
                  >
                    <Check className="h-3 w-3" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing keywords */}
          {missingKeywords.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-navy-900">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Missing Keywords (Add These)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200"
                  >
                    <X className="h-3 w-3" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-900">
              <Lightbulb className="h-4 w-4 text-navy-600" />
              3 Tips to Improve Your Score
            </h4>
            <div className="space-y-2">
              {tips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-navy-800 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreCircle({ score, color }: { score: number; color: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="7" />
          <circle
            cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs font-semibold text-slate-400">/ 100</span>
        </div>
      </div>
      <p className="mt-1 text-xs font-semibold text-slate-500">ATS Score</p>
    </div>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: typeof Check;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-xl ${bg} p-4`}>
      <Icon className={`h-5 w-5 ${color}`} />
      <div>
        <p className="text-2xl font-bold text-navy-900">{value}</p>
        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}
