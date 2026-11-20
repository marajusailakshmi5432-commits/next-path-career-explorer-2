import { useState, useRef, useEffect } from 'react';
import { Compass, Sparkles, Building2, GraduationCap, Search, Plus, FileQuestion } from 'lucide-react';
import type { Degree } from '@/types';

interface HeroProps {
  degrees: Degree[];
  selectedDegree: string;
  onSelectDegree: (name: string) => void;
  onAddCustomDegree: (name: string) => void;
}

export function Hero({
  degrees,
  selectedDegree,
  onSelectDegree,
  onAddCustomDegree,
}: HeroProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = query.trim()
    ? degrees
        .filter((d) => d.name.toLowerCase().includes(query.trim().toLowerCase()))
        .slice(0, 8)
    : degrees.slice(0, 8);

  function handleSelect(name: string) {
    onSelectDegree(name);
    setQuery(name);
    setShowSuggestions(false);
  }

  function handleAddCustom() {
    const trimmed = query.trim();
    if (!trimmed) return;
    const exists = degrees.some(
      (d) => d.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists) {
      onAddCustomDegree(trimmed);
    }
    handleSelect(trimmed);
  }

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(32,214,193,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(32,214,193,0.1),transparent_50%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20 ring-1 ring-teal-400/40">
            <Compass className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            NexPath
          </h1>
        </div>

        <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl">
          Find jobs that match your skills, explore top IT & Non-IT companies,
          and discover easy classes to learn — made for every degree and
          background.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
          <FeatureBadge icon={Sparkles} label="Match Your Skills" />
          <FeatureBadge icon={Building2} label="Explore Companies" />
          <FeatureBadge icon={GraduationCap} label="Find Classes" />
          <FeatureBadge icon={FileQuestion} label="Interview Guide" />
        </div>

        {/* Degree Search Bar */}
        <div className="mt-8" ref={containerRef}>
          <p className="mb-3 text-sm font-semibold text-slate-400">
            Search or enter your degree / study background:
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="e.g., B.Tech, B.Com, Nursing, ITI, 12th Pass..."
                className="w-full rounded-xl bg-white/95 py-3.5 pl-11 pr-4 text-base text-navy-900 outline-none ring-1 ring-white/20 transition focus:bg-white focus:ring-2 focus:ring-teal-400"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl bg-white py-2 shadow-2xl ring-1 ring-slate-200">
                  {suggestions.map((deg) => (
                    <button
                      key={deg.id}
                      onClick={() => handleSelect(deg.name)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-teal-50"
                    >
                      <span className="font-medium">{deg.name}</span>
                      <span className="text-xs text-slate-400">{deg.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (query.trim()) handleSelect(query.trim());
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-base font-semibold text-navy-950 transition hover:bg-teal-400"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>

          <button
            onClick={handleAddCustom}
            className="mt-3 flex items-center gap-1.5 text-sm font-medium text-teal-400 transition hover:text-teal-300"
          >
            <Plus className="h-4 w-4" />
            Add Custom Degree
          </button>

          {selectedDegree && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-4 py-2 text-sm font-semibold text-teal-300 ring-1 ring-teal-400/30">
              <GraduationCap className="h-4 w-4" />
              Your background: {selectedDegree}
            </div>
          )}
        </div>
      </div>

      <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500" />
    </header>
  );
}

function FeatureBadge({
  icon: Icon,
  label,
}: {
  icon: typeof Sparkles;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 backdrop-blur-sm">
      <Icon className="h-4 w-4 text-teal-400" />
      <span className="text-sm font-medium text-slate-200">{label}</span>
    </div>
  );
}
