# Project memory

## Product intent & audience

- **NexPath** is a career readiness / role exploration web app with two main features:
  1. Role search: select skills/degree, search any role, see match readiness and learning roadmap.
  2. Company Interview Prep: search any company/hospital, see profile and interview prep material.
- Audience: job seekers and career changers exploring roles and preparing for company interviews.

## Brand personality & voice

- Professional, encouraging, practical.
- Career-guidance tone; oriented toward actionable next steps (roadmaps, interview prep, hiring steps).

## Visual design & UX direction

- Navy blue and white primary palette with teal accents (set in Tailwind config).
- Layout: Hero section (degree + skill selection) → Role search → Company Interview Prep.
- Role search: category tabs (All, Tech, Medical, Non-Tech, Commerce, Arts, Government); animated readiness circle (green/amber/red by skill match %); role detail with 4-Week Roadmap (12 skills) and top 5 interview questions; save roles capability.
- Company prep: search any company/hospital, never "Not Found"; auto-generates full profile.
  - Company detail: About, salary range, founding year, HQ, website; top 8 skills (user's matched skills highlighted teal); 5 hiring steps as numbered badges; 15 interview questions (8 Technical + 7 HR) each expandable with sample answer and type tag; Download Interview PDF button.
  - Category tabs for popular companies: IT, Hospitals, Banks, Business, Government.
  - "Add Your Own Company" feature for pasting interview questions.
- Lucide React icons throughout (including logos).

## Decisions, constraints & rationale

- Unlimited search in both features: never show "Not Found" — roles and companies auto-created on demand.
- Auto-generated roles include 12 skills: 6 technical, 3 tools, 3 soft skills.
- `RoleExplorer`, `autoGenerate.ts`, and `CompanyPrep.tsx` already existed; `App.tsx` rebuilt to wire all three in.
- Category labels shortened to exact requested names.
- Company prep maintains same design language as role search (navy/white/teal).
- Build (vite-react) passes cleanly after changes.
- Global conventions (Tailwind, hooks, Lucide, `@/` alias) are defined in `.bolt/prompt` and followed.

## Open questions & assumptions

- Persistence mechanism for saved roles unclear — likely client-side only unless backend added later.
- Role/company generation quality depends on `autoGenerate.ts` and `CompanyPrep.tsx` heuristics; no external AI/API integration confirmed.
- Degree field in Hero still present but influence on readiness / roadmap not fully specified.
- PDF generation mechanism and quality not fully specified.
- "Add Your Own Company" data persistence unclear.