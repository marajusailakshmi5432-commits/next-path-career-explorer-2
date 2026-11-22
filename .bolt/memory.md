# Project memory

## Product intent & audience

- **NexPath** is a career readiness / role exploration web app.
- User selects their skills (and degree) up front, then searches any role to see match readiness and a learning roadmap.
- Audience: job seekers and career changers exploring roles across multiple industry categories.

## Brand personality & voice

- Professional, encouraging, practical.
- Career-guidance tone; oriented toward actionable next steps (roadmaps, interview prep).

## Visual design & UX direction

- Navy blue and white primary palette with teal accents (already set in Tailwind config).
- Layout: Hero section (degree + skill selection) → unlimited role search below.
- Category tabs: All, Tech, Medical, Non-Tech, Commerce, Arts, Government.
- Readiness shown as animated circle that shifts green / amber / red based on skill match percentage.
- Role detail includes 4-Week Roadmap (12 skills split into weekly tasks) and top 5 interview questions with sample answers.
- "Save roles" capability for revisiting roles.
- Lucide React icons used throughout (including logos).

## Decisions, constraints & rationale

- Unlimited role search: never show "Not Found" — roles are auto-created on demand.
- Auto-generated roles include 12 skills: 6 technical, 3 tools, 3 soft skills.
- `RoleExplorer` and `autoGenerate.ts` already existed; main `App.tsx` was rebuilt to wire them in, replacing the older NexPath flow.
- Category labels shortened to exact requested names (Tech, Medical, Non-Tech, Commerce, Arts, Government).
- Build (vite-react) passes cleanly after changes.
- Global conventions (Tailwind, hooks, Lucide, `@/` alias) are defined in `.bolt/prompt` and followed.

## Open questions & assumptions

- Persistence mechanism for saved roles unclear — likely client-side only unless backend is added later.
- Role generation quality depends on `autoGenerate.ts` heuristics; no external AI/API integration confirmed.
- Degree field in Hero still present but its influence on readiness / roadmap not fully specified.