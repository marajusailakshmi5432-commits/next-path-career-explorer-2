import { useState } from 'react';
import { Check, ChevronRight, RotateCcw } from 'lucide-react';

interface QuestionStepProps {
  stepNumber: number;
  totalSteps: number;
  question: string;
  subtitle: string;
  options: readonly string[];
  iconMap: Record<string, { icon: string; color: string }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLast: boolean;
}

export function QuestionStep({
  stepNumber,
  totalSteps,
  question,
  subtitle,
  options,
  iconMap,
  selectedValue,
  onSelect,
  onNext,
  onBack,
  isLast,
}: QuestionStepProps) {
  return (
    <div className="animate-slide-up">
      {/* Progress */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i + 1 === stepNumber
                ? 'w-10 bg-slateGreen-600'
                : i + 1 < stepNumber
                  ? 'w-6 bg-slateGreen-400'
                  : 'w-6 bg-cream-400'
            }`}
          />
        ))}
      </div>

      <div className="text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slateGreen-600">
          Question {stepNumber} of {totalSteps}
        </p>
        <h2 className="font-display text-3xl font-semibold text-slateGreen-900 sm:text-4xl">
          {question}
        </h2>
        <p className="mt-3 text-base text-slateGreen-700/70">{subtitle}</p>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const isSelected = selectedValue === option;
          const meta = iconMap[option];
          return (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setTimeout(onNext, 250);
              }}
              className={`group flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-slateGreen-600 bg-slateGreen-50 shadow-md'
                  : 'border-cream-300 bg-white hover:border-slateGreen-400 hover:bg-cream-50'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                  isSelected
                    ? 'bg-slateGreen-600 text-white'
                    : 'bg-cream-200 text-slateGreen-700 group-hover:bg-slateGreen-100'
                }`}
              >
                <OptionIcon name={meta?.icon ?? 'Circle'} />
              </div>
              <span
                className={`flex-1 text-sm font-semibold sm:text-base ${
                  isSelected ? 'text-slateGreen-900' : 'text-slateGreen-800'
                }`}
              >
                {option}
              </span>
              {isSelected && <Check className="h-5 w-5 shrink-0 text-slateGreen-600" />}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {stepNumber > 1 && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-cream-400 bg-white px-5 py-2.5 text-sm font-semibold text-slateGreen-700 transition hover:bg-cream-50"
          >
            <RotateCcw className="h-4 w-4" />
            Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!selectedValue}
          className="flex items-center gap-2 rounded-xl bg-slateGreen-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slateGreen-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLast ? 'See My Future' : 'Next'}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function OptionIcon({ name }: { name: string }) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {};
  // Lazy import approach: we'll use a simple mapping
  return <IconWrapper name={name} />;
}

// Use a small wrapper that imports from lucide-react
import {
  GraduationCap, Users, Heart, Stethoscope, HardHat, Cog,
  MonitorSmartphone, Plane, BedDouble, ChefHat, Briefcase,
  Landmark, Globe, User, UserCircle, HelpCircle, Circle,
  BookOpen, Wrench, Rocket, Shield, Train, FileText, Target,
  Laptop, Presentation, PartyPopper, Cake, UtensilsCrossed,
  BellRing, Luggage, FlaskConical, Pill, HeartPulse, Zap, Car,
  Settings, BarChart3, Code2, Compass,
} from 'lucide-react';

const LUCIDE_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, Users, Heart, Stethoscope, HardHat, Cog,
  MonitorSmartphone, Plane, BedDouble, ChefHat, Briefcase,
  Landmark, Globe, User, UserCircle, HelpCircle, Circle,
  BookOpen, Wrench, Rocket, Shield, Train, FileText, Target,
  Laptop, Presentation, PartyPopper, Cake, UtensilsCrossed,
  BellRing, Luggage, FlaskConical, Pill, HeartPulse, Zap, Car,
  Settings, BarChart3, Code2, Compass,
};

function IconWrapper({ name }: { name: string }) {
  const Icon = LUCIDE_MAP[name] ?? Circle;
  return <Icon className="h-5 w-5" />;
}
