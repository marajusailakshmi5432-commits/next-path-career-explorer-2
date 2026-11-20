import { Linkedin, Heart } from 'lucide-react';

const LINKEDIN_URL = 'https://www.linkedin.com/in/sai-lakshmi-maraju-26200a327';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="flex items-center gap-1.5 text-sm text-slate-600 text-center sm:text-left">
            Designed &amp; Built by
            <span className="font-semibold text-navy-800">
              Sai Lakshmi Maraju
            </span>
            <Heart className="h-3.5 w-3.5 fill-teal-500 text-teal-500" />
          </p>

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-navy-700 ring-1 ring-slate-200 transition hover:bg-slate-200 hover:ring-slate-300"
          >
            <Linkedin className="h-4 w-4 text-[#0a66c2]" />
            <span>Connect on LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
