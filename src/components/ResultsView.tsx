import {
  Check, RotateCcw, Bookmark, TrendingUp, IndianRupee, GraduationCap, Sparkles, Users,
} from 'lucide-react';
import { getJobs, getCareerPath, getInterestIcon } from '@/lib/jobData';
import type { JobMatch } from '@/lib/jobData';
import {
  GraduationCap, HeartPulse, Pill, FlaskConical, Code2, Cog,
  HardHat, Zap, Wrench, Car, Settings, BarChart3, Globe,
  MonitorSmartphone, BookOpen, Laptop, Presentation, Plane,
  Luggage, BedDouble, BellRing, PartyPopper, ChefHat, Cake,
  UtensilsCrossed, Briefcase, Target, Rocket, Users, Landmark,
  FileText, Train, Shield, Compass, Circle,
} from 'lucide-react';

const LUCIDE_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, HeartPulse, Pill, FlaskConical, Code2, Cog,
  HardHat, Zap, Wrench, Car, Settings, BarChart3, Globe,
  MonitorSmartphone, BookOpen, Laptop, Presentation, Plane,
  Luggage, BedDouble, BellRing, PartyPopper, ChefHat, Cake,
  UtensilsCrossed, Briefcase, Target, Rocket, Users, Landmark,
  FileText, Train, Shield, Compass, Circle,
};

interface ResultsViewProps {
  studying: string;
  gender: string;
  interest: string;
  onRestart: () => void;
}

export function ResultsView({ studying, gender, interest, onRestart }: ResultsViewProps) {
  const jobs = getJobs(studying, gender, interest);
  const careerPath = getCareerPath(studying, interest);
  const interestIcon = getInterestIcon(interest);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Summary banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slateGreen-800 to-slateGreen-950 p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slateGreen-200">Your Future Lens Result</p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
              {interest} Career Path
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <SummaryTag icon={GraduationCap} label={studying} />
              <SummaryTag icon={Users} label={gender} />
              <SummaryTag icon={Sparkles} label={interest} />
            </div>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <IconWrapper name={interestIcon} />
          </div>
        </div>

        {/* Career path */}
        <div className="mt-6 rounded-xl bg-white/10 p-4 ring-1 ring-white/15">
          <p className="text-xs font-semibold uppercase tracking-wide text-slateGreen-200">
            Your Suggested Career Path
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slateGreen-50">{careerPath}</p>
        </div>
      </div>

      {/* Eligible Jobs */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-semibold text-slateGreen-900 sm:text-2xl">
              Eligible Jobs For You
            </h3>
            <p className="mt-1 text-sm text-slateGreen-700/70">
              Based on your studying level, gender, and interest
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job, idx) => (
            <JobCard key={idx} job={job} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-center">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 rounded-xl bg-slateGreen-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slateGreen-800"
        >
          <RotateCcw className="h-4 w-4" />
          Start Over
        </button>
        <button
          className="flex items-center gap-2 rounded-xl border border-cream-400 bg-white px-6 py-3 text-sm font-semibold text-slateGreen-700 transition hover:bg-cream-50"
        >
          <Bookmark className="h-4 w-4" />
          Save My Result
        </button>
      </div>
    </div>
  );
}

function JobCard({ job }: { job: JobMatch }) {
  return (
    <div className="flex flex-col rounded-2xl border border-cream-300 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slateGreen-100 text-slateGreen-700">
          <IconWrapper name={job.icon} />
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-slateGreen-900">{job.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-slateGreen-700/80">{job.description}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5 border-t border-cream-200 pt-4">
        <div className="flex items-start gap-2">
          <IndianRupee className="mt-0.5 h-4 w-4 shrink-0 text-slateGreen-600" />
          <div>
            <p className="text-xs font-semibold text-slateGreen-600">Salary Range</p>
            <p className="text-sm font-semibold text-slateGreen-800">{job.salaryRange}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slateGreen-600" />
          <div>
            <p className="text-xs font-semibold text-slateGreen-600">Eligibility</p>
            <p className="text-sm text-slateGreen-800">{job.eligibility}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-slateGreen-600" />
          <div>
            <p className="text-xs font-semibold text-slateGreen-600">Why This Matches You</p>
            <p className="text-sm text-slateGreen-800">{job.whyMatches}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slateGreen-600">
        <Check className="h-3.5 w-3.5" />
        Recommended for your profile
      </div>
    </div>
  );
}

function SummaryTag({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-slateGreen-50 ring-1 ring-white/20">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function IconWrapper({ name }: { name: string }) {
  const Icon = LUCIDE_MAP[name] ?? Circle;
  return <Icon className="h-8 w-8" />;
}

import { Users } from 'lucide-react';
