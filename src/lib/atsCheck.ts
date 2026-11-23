// ATS resume scoring logic — analyzes resume text for keyword presence,
// section completeness, and formatting indicators.

export interface ATSResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  tips: string[];
}

const TECHNICAL_KEYWORDS = [
  'Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
  'TypeScript', 'AWS', 'Docker', 'Git', 'Linux', 'API', 'REST', 'MongoDB',
  'PostgreSQL', 'MySQL', 'C++', 'C#', '.NET', 'Spring', 'Django', 'Flask',
  'TensorFlow', 'Machine Learning', 'Data Analysis', 'Excel', 'Power BI',
  'Tableau', 'PowerPoint', 'SEO', 'Digital Marketing', 'Tally', 'Accounting',
  'Financial Analysis', 'GST', 'Auditing', 'Communication', 'Leadership',
  'Project Management', 'Teamwork', 'Problem Solving', 'Agile', 'Scrum',
  'Customer Service', 'Sales', 'Operations', 'Quality Assurance', 'Testing',
];

const SECTION_INDICATORS = [
  { label: 'Experience', patterns: ['experience', 'work history', 'employment', 'professional experience'] },
  { label: 'Education', patterns: ['education', 'degree', 'university', 'college', 'academic'] },
  { label: 'Skills', patterns: ['skills', 'technical skills', 'core competencies', 'proficiencies'] },
  { label: 'Projects', patterns: ['project', 'projects', 'portfolio'] },
  { label: 'Contact', patterns: ['email', 'phone', 'contact', '@'] },
];

const NEGATIVE_INDICATORS = [
  'table', 'graphic', 'image', 'chart', 'text box', 'header', 'footer',
  'column', 'multiple columns', 'photo', 'picture',
];

function extractKeywords(text: string): { matched: string[]; missing: string[] } {
  const lowerText = text.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of TECHNICAL_KEYWORDS) {
    if (lowerText.includes(kw.toLowerCase())) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  return { matched, missing };
}

function checkSections(text: string): string[] {
  const lowerText = text.toLowerCase();
  return SECTION_INDICATORS.filter((s) =>
    s.patterns.some((p) => lowerText.includes(p))
  ).map((s) => s.label);
}

function checkNegativeIndicators(text: string): string[] {
  const lowerText = text.toLowerCase();
  return NEGATIVE_INDICATORS.filter((ind) => lowerText.includes(ind));
}

function generateTips(
  missingKeywords: string[],
  foundSections: string[],
  negatives: string[],
  wordCount: number
): string[] {
  const tips: string[] = [];

  const topMissing = missingKeywords.slice(0, 5);
  if (topMissing.length > 0) {
    tips.push(
      `Add relevant keywords from your field. Consider including: ${topMissing.join(', ')}. ATS systems scan for these terms to rank your resume.`
    );
  }

  const missingSections = SECTION_INDICATORS.filter(
    (s) => !foundSections.includes(s.label)
  ).map((s) => s.label);

  if (missingSections.length > 0) {
    tips.push(
      `Your resume may be missing these standard sections: ${missingSections.join(', ')}. Use clear section headings so ATS can parse them.`
    );
  }

  if (negatives.length > 0) {
    tips.push(
      `Avoid using ${negatives.join(', ')} in your resume. ATS parsers struggle with complex formatting — use a simple, single-column layout with standard fonts.`
    );
  }

  if (wordCount < 200) {
    tips.push(
      'Your resume seems short. Aim for 300-500 words with specific achievements and measurable results (e.g., "Improved efficiency by 20%") rather than vague duty lists.'
    );
  }

  if (tips.length < 3) {
    tips.push(
      'Tailor your resume for each job application by matching keywords from the job description. Use exact phrases from the posting to improve your ATS score.'
    );
  }

  if (tips.length < 3) {
    tips.push(
      'Use standard section titles (Experience, Education, Skills) and a clean format. Save as a standard PDF or DOCX — avoid images, text boxes, or unusual fonts.'
    );
  }

  return tips.slice(0, 3);
}

export function analyzeResume(text: string): ATSResult {
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  const { matched, missing } = extractKeywords(trimmed);
  const foundSections = checkSections(trimmed);
  const negatives = checkNegativeIndicators(trimmed);

  let score = 0;

  // Keyword density: up to 50 points
  const keywordRatio = matched.length / TECHNICAL_KEYWORDS.length;
  score += Math.round(keywordRatio * 50);

  // Section completeness: up to 30 points (6 points per section found)
  score += Math.min(foundSections.length * 6, 30);

  // Word count: up to 10 points
  if (wordCount >= 300 && wordCount <= 700) {
    score += 10;
  } else if (wordCount >= 200) {
    score += 5;
  }

  // Negative formatting: penalize
  score -= negatives.length * 5;

  // Clean formatting bonus: up to 10 points
  if (negatives.length === 0) {
    score += 10;
  }

  score = Math.max(0, Math.min(100, score));

  const topMissing = missing.slice(0, 10);
  const tips = generateTips(topMissing, foundSections, negatives, wordCount);

  return {
    score,
    matchedKeywords: matched,
    missingKeywords: topMissing,
    tips,
  };
}
