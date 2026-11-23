// ATS resume scoring logic — 100-point breakdown:
//   - 12 skill keywords x 5 points = 60
//   - Experience section keywords = 10
//   - Education section keywords = 10
//   - Action verbs = 10
//   - Length > 200 words = 10

export interface ATSResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  tips: string[];
  charCount: number;
}

const SKILL_KEYWORDS = [
  'Python', 'Java', 'JavaScript', 'React', 'SQL', 'AWS',
  'Docker', 'Git', 'Node.js', 'TypeScript', 'Machine Learning', 'Communication',
];

const EXPERIENCE_PATTERNS = [
  'experience', 'work history', 'employment', 'professional experience',
  'intern', 'worked at', 'responsible for', 'managed', 'developed',
];

const EDUCATION_PATTERNS = [
  'education', 'degree', 'university', 'college', 'academic',
  'bachelor', 'master', 'phd', 'diploma', 'certification',
];

const ACTION_VERBS = [
  'achieved', 'built', 'created', 'designed', 'developed', 'implemented',
  'improved', 'led', 'managed', 'launched', 'optimized', 'delivered',
  'analyzed', 'established', 'coordinated', 'streamlined', 'increased',
  'reduced', 'spearheaded', 'automated',
];

function findMatches(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw.toLowerCase()));
}

function generateTips(
  missingSkills: string[],
  hasExperience: boolean,
  hasEducation: boolean,
  hasActionVerbs: boolean,
  wordCount: number,
): string[] {
  const tips: string[] = [];

  const topMissing = missingSkills.slice(0, 5);
  if (topMissing.length > 0) {
    tips.push(
      `Add relevant technical keywords to your resume. Consider including: ${topMissing.join(', ')}. ATS systems scan for these terms to rank your resume.`,
    );
  }

  if (!hasExperience) {
    tips.push(
      'Add a clear "Experience" or "Work History" section with job titles, company names, and dates. Use phrases like "responsible for" or "developed" to describe what you did.',
    );
  }

  if (!hasEducation) {
    tips.push(
      'Include an "Education" section listing your degree, university/college name, and graduation year. ATS parsers look for words like "degree", "university", or "bachelor".',
    );
  }

  if (!hasActionVerbs) {
    tips.push(
      'Start bullet points with strong action verbs like "Developed", "Managed", "Improved", or "Delivered". This signals impact and leadership to both ATS and recruiters.',
    );
  }

  if (wordCount < 200) {
    tips.push(
      'Your resume seems short. Aim for 300-500 words with specific achievements and measurable results (e.g., "Improved efficiency by 20%") rather than vague duty lists.',
    );
  }

  if (tips.length < 3) {
    tips.push(
      'Tailor your resume for each job application by matching keywords from the job description. Use exact phrases from the posting to improve your ATS score.',
    );
  }

  return tips.slice(0, 3);
}

export function analyzeResume(text: string): ATSResult {
  const trimmed = text.trim();
  const charCount = trimmed.length;
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  // 1) Skills: 12 keywords x 5 points = 60
  const matchedSkills = findMatches(trimmed, SKILL_KEYWORDS);
  const missingSkills = SKILL_KEYWORDS.filter(
    (kw) => !matchedSkills.some((m) => m.toLowerCase() === kw.toLowerCase()),
  );
  const skillPoints = matchedSkills.length * 5;

  // 2) Experience keywords: 10 points
  const matchedExperience = findMatches(trimmed, EXPERIENCE_PATTERNS);
  const experiencePoints = matchedExperience.length > 0 ? 10 : 0;

  // 3) Education keywords: 10 points
  const matchedEducation = findMatches(trimmed, EDUCATION_PATTERNS);
  const educationPoints = matchedEducation.length > 0 ? 10 : 0;

  // 4) Action verbs: 10 points
  const matchedVerbs = findMatches(trimmed, ACTION_VERBS);
  const verbPoints = matchedVerbs.length > 0 ? 10 : 0;

  // 5) Length > 200 words: 10 points
  const lengthPoints = wordCount > 200 ? 10 : 0;

  const score = Math.min(100, skillPoints + experiencePoints + educationPoints + verbPoints + lengthPoints);

  const tips = generateTips(
    missingSkills,
    matchedExperience.length > 0,
    matchedEducation.length > 0,
    matchedVerbs.length > 0,
    wordCount,
  );

  return {
    score,
    matchedKeywords: matchedSkills,
    missingKeywords: missingSkills.slice(0, 10),
    tips,
    charCount,
  };
}
