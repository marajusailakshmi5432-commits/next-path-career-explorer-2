// Auto-generation logic for roles, companies, skills, questions, and roadmaps.
// Everything is generated client-side so any search produces content — never "Not Found".

// ─── Role generation ───────────────────────────────────────

export interface GeneratedRole {
  name: string;
  category: string;
  description: string;
  skills: string[];
  technicalSkills: string[];
  tools: string[];
  softSkills: string[];
  salaryRange: string;
  readiness: number;
  roadmap: { week: number; title: string; tasks: string[] }[];
  interviewQuestions: { question: string; answer: string }[];
}

const ROLE_CATEGORIES = [
  'All',
  'Tech / IT',
  'Non-Tech / Business',
  'Medical / Healthcare',
  'Commerce / Finance',
  'Arts / Design',
  'Government / Others',
] as const;

const TECH_SKILL_POOLS: Record<string, string[]> = {
  'Tech / IT': ['Python', 'Java', 'SQL', 'JavaScript', 'React', 'Node.js', 'Cloud Basics', 'Data Structures', 'HTML/CSS', 'Git'],
  'Non-Tech / Business': ['Excel', 'PowerPoint', 'CRM Software', 'Data Analysis', 'Google Sheets', 'Email Marketing', 'SEO Basics', 'Social Media Tools', 'Market Research', 'Business Writing'],
  'Medical / Healthcare': ['Patient Care', 'Anatomy', 'Pharmacology', 'Medical Records', 'Infection Control', 'First Aid', 'Vital Signs', 'Medical Terminology', 'Health & Safety', 'Clinical Procedures'],
  'Commerce / Finance': ['Tally', 'Accounting', 'Financial Analysis', 'Taxation', 'Auditing', 'Banking Operations', 'GST', 'Payroll', 'Bookkeeping', 'Financial Reporting'],
  'Arts / Design': ['Graphic Design', 'Photoshop', 'Illustrator', 'Figma', 'Content Writing', 'Video Editing', 'Photography', 'Typography', 'Color Theory', 'UI Design'],
  'Government / Others': ['General Knowledge', 'Current Affairs', 'Aptitude', 'Reasoning', 'English', 'Polity', 'History', 'Geography', 'Public Administration', 'Law Basics'],
};

const TOOL_POOLS: Record<string, string[]> = {
  'Tech / IT': ['VS Code', 'GitHub', 'Postman', 'Docker'],
  'Non-Tech / Business': ['MS Office', 'Slack', 'Trello', 'Google Workspace'],
  'Medical / Healthcare': ['Hospital Management System', 'Medical Devices', 'Lab Equipment', 'Patient Monitors'],
  'Commerce / Finance': ['Tally ERP', 'QuickBooks', 'SAP', 'Excel Advanced'],
  'Arts / Design': ['Adobe CC', 'Canva', 'Figma', 'CorelDRAW'],
  'Government / Others': ['MS Office', 'Online Exam Portals', 'Typing Software', 'Email'],
};

const SOFT_SKILLS = ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Leadership', 'Adaptability'];

const POPULAR_ROLES: Record<string, string[]> = {
  'All': ['Software Engineer', 'Data Analyst', 'Financial Analyst', 'Staff Nurse', 'HR Recruiter', 'Digital Marketing Executive'],
  'Tech / IT': ['Software Engineer', 'Data Analyst', 'Full Stack Developer', 'IT Support Technician', 'DevOps Engineer', 'QA Tester'],
  'Non-Tech / Business': ['HR Recruiter', 'Operations Executive', 'Business Analyst', 'Project Coordinator', 'Sales Executive', 'Marketing Manager'],
  'Medical / Healthcare': ['Staff Nurse', 'Pharmacist', 'Lab Technician', 'Medical Officer', 'Healthcare Administrator', 'Radiologist'],
  'Commerce / Finance': ['Financial Analyst', 'Accountant', 'Bank Associate', 'Tax Consultant', 'Audit Assistant', 'Payroll Executive'],
  'Arts / Design': ['Content Writer', 'Graphic Designer', 'UI/UX Designer', 'Social Media Manager', 'Video Editor', 'Photographer'],
  'Government / Others': ['IAS Officer', 'Bank PO', 'SSC Clerk', 'Forest Officer', 'Police Constable', 'Teacher'],
};

function guessCategory(roleName: string): string {
  const lower = roleName.toLowerCase();
  if (/engineer|developer|software|data|program|coding|it |tech|devops|qa|tester|admin|cyber|cloud|ai |ml /i.test(lower)) return 'Tech / IT';
  if (/nurse|pharma|lab|medical|doctor|health|patient|clinic|radiolog|surgeon|dental|physio/i.test(lower)) return 'Medical / Healthcare';
  if (/financ|account|bank|tax|audit|payroll|tally|ca |gst|investment|insurance|loan/i.test(lower)) return 'Commerce / Finance';
  if (/design|content|graphic|writer|video|photo|media|art|ui|ux|creative|editor/i.test(lower)) return 'Arts / Design';
  if (/ias|ips|ssc|upsc|government|govt|police|forest|teacher|clerk|po |officer|public/i.test(lower)) return 'Government / Others';
  return 'Non-Tech / Business';
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function generateRole(name: string, selectedSkills: string[] = []): GeneratedRole {
  const category = guessCategory(name);
  const techPool = TECH_SKILL_POOLS[category] ?? TECH_SKILL_POOLS['Non-Tech / Business'];
  const toolPool = TOOL_POOLS[category] ?? TOOL_POOLS['Non-Tech / Business'];

  const technicalSkills = pickN(techPool, 6);
  const tools = pickN(toolPool, 3);
  const softSkills = pickN(SOFT_SKILLS, 3);
  const skills = [...technicalSkills, ...tools, ...softSkills];

  const matched = skills.filter((s) =>
    selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())
  );
  const readiness = Math.round((matched.length / skills.length) * 100);

  const salaryRanges: Record<string, string> = {
    'Tech / IT': '3.5 - 12 LPA',
    'Non-Tech / Business': '2.5 - 8 LPA',
    'Medical / Healthcare': '2.5 - 7 LPA',
    'Commerce / Finance': '3 - 8 LPA',
    'Arts / Design': '2.5 - 7 LPA',
    'Government / Others': '3 - 10 LPA',
  };

  const descriptions: Record<string, string> = {
    'Tech / IT': `A ${name} builds, tests, and maintains technology solutions using programming and problem-solving skills.`,
    'Non-Tech / Business': `A ${name} manages business operations, coordinates teams, and helps the organization run smoothly.`,
    'Medical / Healthcare': `A ${name} provides care, support, or expertise in a healthcare setting to keep patients safe and healthy.`,
    'Commerce / Finance': `A ${name} manages money, records, and financial processes to keep a business financially healthy.`,
    'Arts / Design': `A ${name} creates visual, written, or multimedia content that communicates ideas and engages audiences.`,
    'Government / Others': `A ${name} serves in a public sector role supporting government functions and public services.`,
  };

  return {
    name,
    category,
    description: descriptions[category] ?? `A ${name} contributes to their organization through specialized skills and teamwork.`,
    skills,
    technicalSkills,
    tools,
    softSkills,
    salaryRange: salaryRanges[category] ?? '2.5 - 8 LPA',
    readiness,
    roadmap: generateRoadmap(skills),
    interviewQuestions: generateRoleQuestions(name, category),
  };
}

function generateRoadmap(skills: string[]): { week: number; title: string; tasks: string[] }[] {
  const week1 = skills.slice(0, 3);
  const week2 = skills.slice(3, 6);
  const week3 = skills.slice(6, 9);
  const week4 = skills.slice(9, 12);

  return [
    { week: 1, title: 'Build Your Foundation', tasks: week1.map(s => `Learn basics of ${s}`) },
    { week: 2, title: 'Practice Hands-On', tasks: week2.map(s => `Practice ${s} with small exercises`) },
    { week: 3, title: 'Apply to Real Projects', tasks: week3.map(s => `Use ${s} in a mini-project`) },
    { week: 4, title: 'Review & Interview Prep', tasks: [...week4.map(s => `Revise ${s}`), 'Practice interview questions', 'Build your resume'] },
  ];
}

function generateRoleQuestions(roleName: string, category: string): { question: string; answer: string }[] {
  const general = [
    { question: `Tell me about yourself.`, answer: `I am a candidate aiming for the ${roleName} role. I have a strong foundation in the key skills required and I am eager to learn and contribute to the team. I enjoy solving problems and working with others.` },
    { question: `Why do you want to be a ${roleName}?`, answer: `I am passionate about this field because it matches my skills and interests. I want to grow my career as a ${roleName} and make a meaningful contribution to the organization.` },
    { question: `What are your greatest strengths?`, answer: `My strengths are my willingness to learn, my ability to work well in a team, and my problem-solving mindset. I stay calm under pressure and always try to find solutions.` },
    { question: `Where do you see yourself in 5 years?`, answer: `In 5 years, I see myself as an experienced ${roleName} who has grown significantly, taken on more responsibilities, and is helping mentor new team members.` },
    { question: `Why should we hire you for this role?`, answer: `You should hire me because I have the right skills, a strong learning attitude, and genuine enthusiasm for this role. I am ready to work hard and add value to the team from day one.` },
  ];

  const catSpecific: Record<string, { question: string; answer: string }> = {
    'Tech / IT': { question: `What programming languages or tools are you comfortable with?`, answer: `I am comfortable with the key tools and languages relevant to the ${roleName} role. I have practiced them through projects and exercises and I am quick to learn new technologies.` },
    'Non-Tech / Business': { question: `How do you handle a difficult situation at work?`, answer: `I stay calm, try to understand the root cause, and communicate with my team to find the best solution. I focus on resolving the issue rather than worrying about it.` },
    'Medical / Healthcare': { question: `How do you handle a medical emergency or a difficult patient?`, answer: `I stay calm, follow established protocols, and prioritize patient safety. I communicate clearly with the team and the patient to ensure the best possible care.` },
    'Commerce / Finance': { question: `How do you ensure accuracy in your financial work?`, answer: `I double-check all calculations, cross-reference with source data, and follow standard procedures. I keep organized records so errors can be caught and fixed quickly.` },
    'Arts / Design': { question: `Can you walk us through your creative process?`, answer: `I start by understanding the goal and audience, then research and brainstorm ideas, create drafts, and refine based on feedback. I always keep the end user in mind.` },
    'Government / Others': { question: `How do you prepare for a competitive exam or government role?`, answer: `I create a study plan, cover subjects systematically, practice previous papers, and stay updated on current affairs. I stay consistent and revise regularly.` },
  };

  return [...general.slice(0, 4), catSpecific[category] ?? general[4]];
}

export function getPopularRoles(category: string): string[] {
  return POPULAR_ROLES[category] ?? POPULAR_ROLES['All'];
}

export const ROLE_CATEGORY_TABS = ROLE_CATEGORIES;

// ─── Company generation ────────────────────────────────────

export interface GeneratedCompany {
  name: string;
  category: string;
  about: string;
  foundedYear: string;
  hq: string;
  website: string;
  salaryRange: string;
  topSkills: string[];
  hiringProcess: string[];
  interviewQuestions: { question: string; answer: string; type: 'Technical' | 'HR' }[];
  previousYearQuestions: string[];
  resumeTips: string[];
}

const COMPANY_CATEGORIES = [
  'All',
  'IT / Tech',
  'Hospitals / Medical',
  'Banks / Finance',
  'Business / Non-Tech',
  'Government / Exams',
] as const;

const COMPANY_SKILL_POOLS: Record<string, string[]> = {
  'IT / Tech': ['Python', 'Java', 'SQL', 'Problem Solving', 'Data Structures', 'Algorithms', 'Communication', 'Cloud Basics'],
  'Hospitals / Medical': ['Patient Care', 'Communication', 'Teamwork', 'Medical Knowledge', 'Empathy', 'Time Management', 'Safety Protocols', 'Record Keeping'],
  'Banks / Finance': ['Communication', 'MS Excel', 'Aptitude', 'Banking Knowledge', 'Customer Service', 'Numerical Ability', 'Reasoning', 'English'],
  'Business / Non-Tech': ['Communication', 'MS Excel', 'Sales', 'Customer Support', 'Operations', 'Teamwork', 'Leadership', 'Problem Solving'],
  'Government / Exams': ['General Knowledge', 'Current Affairs', 'Aptitude', 'Reasoning', 'English', 'Polity', 'History', 'Quantitative Ability'],
};

const POPULAR_COMPANIES: Record<string, string[]> = {
  'All': ['TCS', 'Infosys', 'HDFC Bank', 'Apollo Hospitals', 'Amazon', 'Reliance', 'ONGC', 'Zoho'],
  'IT / Tech': ['TCS', 'Infosys', 'Amazon', 'Zoho', 'Wipro', 'HCL', 'Tech Mahindra', 'Flipkart'],
  'Hospitals / Medical': ['Apollo Hospitals', 'Fortis', 'AIIMS', 'Sun Pharma', 'Cipla', 'Manipal', 'Narayana Health', 'Max Healthcare'],
  'Banks / Finance': ['HDFC Bank', 'ICICI Bank', 'SBI', 'Deloitte', 'EY', 'Axis Bank', 'Kotak', 'RBI'],
  'Business / Non-Tech': ['Reliance', 'Tata Motors', 'ITC', 'L&T', 'Big Bazaar', 'Tata Consumer', 'Aditya Birla', 'Mahindra'],
  'Government / Exams': ['ONGC', 'ISRO', 'Indian Army', 'BHEL', 'Railways', 'UPSC', 'SSC', 'DRDO'],
};

function guessCompanyCategory(name: string): string {
  const lower = name.toLowerCase();
  if (/tcs|infosys|zoho|amazon|wipro|hcl|tech mahindra|flipkart|google|microsoft|accenture|cognizant|ibm|oracle|sap/i.test(lower)) return 'IT / Tech';
  if (/hospital|apollo|fortis|aiims|pharma|cipla|sun pharma|manipal|narayana|max|medical|clinic|lab/i.test(lower)) return 'Hospitals / Medical';
  if (/bank|hdfc|icici|sbi|axis|kotak|deloitte|ey |ernst|pwc|kpmg|rbi|insurance|loan|finance/i.test(lower)) return 'Banks / Finance';
  if (/ongc|isro|army|bhel|railway|upsc|ssc|drdo|government|govt|public|psu|defence/i.test(lower)) return 'Government / Exams';
  return 'Business / Non-Tech';
}

export function generateCompany(name: string): GeneratedCompany {
  const category = guessCompanyCategory(name);
  const skillPool = COMPANY_SKILL_POOLS[category] ?? COMPANY_SKILL_POOLS['Business / Non-Tech'];
  const topSkills = pickN(skillPool, 8);

  const hiringProcess = [
    'Online Application / Aptitude Test',
    'Technical / Domain Interview',
    'Group Discussion or Case Study',
    'Managerial Round',
    'HR Round & Offer',
  ];

  const abouts: Record<string, string> = {
    'IT / Tech': `${name} is a technology company that builds software, digital products, and IT services for clients across India and worldwide. The company is known for its innovative work culture and focus on continuous learning.`,
    'Hospitals / Medical': `${name} is a healthcare organization that provides medical care, diagnostic services, and patient support. It is known for its quality healthcare standards and commitment to patient wellbeing.`,
    'Banks / Finance': `${name} is a financial services organization offering banking, loans, investments, and advisory services. It serves millions of customers and is known for its customer-first approach.`,
    'Business / Non-Tech': `${name} is a business company that operates in retail, manufacturing, or services. It is known for its strong brand presence and wide reach across India.`,
    'Government / Exams': `${name} is a government or public sector organization that serves the nation through its mandated functions. It offers stable career opportunities through competitive exams and direct recruitment.`,
  };

  const salaryRanges: Record<string, string> = {
    'IT / Tech': '3.5 - 15 LPA',
    'Hospitals / Medical': '2.5 - 8 LPA',
    'Banks / Finance': '3 - 10 LPA',
    'Business / Non-Tech': '2.5 - 8 LPA',
    'Government / Exams': '3 - 12 LPA',
  };

  const hqs: Record<string, string> = {
    'IT / Tech': 'Bengaluru, India',
    'Hospitals / Medical': 'Chennai, India',
    'Banks / Finance': 'Mumbai, India',
    'Business / Non-Tech': 'Mumbai, India',
    'Government / Exams': 'New Delhi, India',
  };

  const foundedYears = ['1985', '1990', '1995', '2000', '2005', '2010', '1981', '1975'];

  return {
    name,
    category,
    about: abouts[category] ?? `${name} is an organization that hires for various roles across different functions.`,
    foundedYear: pickN(foundedYears, 1)[0],
    hq: hqs[category] ?? 'India',
    website: `www.${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    salaryRange: salaryRanges[category] ?? '3 - 8 LPA',
    topSkills,
    hiringProcess,
    interviewQuestions: generateCompanyQuestions(name, category),
    previousYearQuestions: generatePYQs(name, category),
    resumeTips: generateResumeTips(name, category),
  };
}

function generateCompanyQuestions(name: string, category: string): { question: string; answer: string; type: 'Technical' | 'HR' }[] {
  const technical: { question: string; answer: string; type: 'Technical' | 'HR' }[] = [
    { question: `What do you know about ${name}?`, answer: `${name} is a well-known organization in the ${category} sector. I have researched their work, values, and recent projects, and I am impressed by their impact and growth.`, type: 'Technical' },
    { question: `Explain a key concept from your field.`, answer: `I can explain a core concept from my studies clearly and with examples. I believe in understanding fundamentals deeply so I can apply them in real situations at ${name}.`, type: 'Technical' },
    { question: `How would you solve a problem you have not seen before?`, answer: `I would break the problem into smaller parts, research what I do not know, ask for help if needed, and test my solution step by step before finalizing it.`, type: 'Technical' },
    { question: `What project are you most proud of?`, answer: `I am proud of a project where I applied my learning to build something useful. It taught me how to plan, execute, and handle challenges along the way.`, type: 'Technical' },
    { question: `How do you stay updated in your field?`, answer: `I follow industry news, take online courses, and practice regularly. I believe learning should never stop, especially in a fast-moving field.`, type: 'Technical' },
    { question: `Describe a technical challenge you faced and how you overcame it.`, answer: `I faced a challenge where things were not working as expected. I debugged step by step, read documentation, and asked for guidance. I solved it and learned a lot from the experience.`, type: 'Technical' },
    { question: `What tools or technologies are you most comfortable with?`, answer: `I am comfortable with the core tools relevant to this role. I have used them in projects and I am always open to learning new ones that ${name} uses.`, type: 'Technical' },
    { question: `How do you ensure quality in your work?`, answer: `I review my work carefully, test it thoroughly, and ask for feedback. I believe quality comes from attention to detail and a willingness to improve.`, type: 'Technical' },
  ];

  const hr: { question: string; answer: string; type: 'Technical' | 'HR' }[] = [
    { question: `Tell me about yourself.`, answer: `I am a motivated candidate with a strong academic background and a passion for this field. I am excited about the opportunity to join ${name} and contribute to the team.`, type: 'HR' },
    { question: `Why do you want to join ${name}?`, answer: `I want to join ${name} because of its strong reputation, learning culture, and the meaningful work it does. I see a great opportunity to grow my career here.`, type: 'HR' },
    { question: `What are your strengths and weaknesses?`, answer: `My strength is my ability to learn quickly and work well with others. My weakness is that I can be too detail-focused at times, but I am learning to balance speed and quality.`, type: 'HR' },
    { question: `Where do you see yourself in 5 years?`, answer: `In 5 years, I see myself as a skilled professional who has grown significantly at ${name}, taken on more responsibilities, and contributed to important projects.`, type: 'HR' },
    { question: `How do you handle working under pressure?`, answer: `I stay calm, prioritize my tasks, and focus on one thing at a time. I communicate with my team and ask for help when needed. Pressure helps me perform better.`, type: 'HR' },
    { question: `Are you willing to relocate?`, answer: `Yes, I am willing to relocate. I see it as an opportunity to experience a new place, work with different teams, and grow both personally and professionally.`, type: 'HR' },
    { question: `Do you have any questions for us?`, answer: `Yes, I would like to know what a typical day looks like for someone in this role and what skills I should focus on before joining.`, type: 'HR' },
  ];

  return [...technical, ...hr];
}

function generatePYQs(name: string, category: string): string[] {
  if (category === 'Government / Exams') {
    return [
      `General Awareness: What are the key functions of the ${name} organization?`,
      `Reasoning: If A is taller than B and B is taller than C, who is the shortest?`,
      `Quantitative: A train travels 300 km in 5 hours. What is its speed?`,
      `English: Choose the correct synonym for "Diligent" — (a) Lazy (b) Hardworking (c) Careless (d) Slow`,
      `Current Affairs: What was the recent major policy announced related to this sector?`,
    ];
  }

  return [
    `Aptitude: A shop gives 20% discount on an item marked at Rs. 500. What is the selling price?`,
    `Logical: Complete the series: 2, 6, 12, 20, 30, ?`,
    `Technical: Explain the difference between a primary key and a foreign key.`,
    `Verbal: Rewrite the sentence in passive voice: "The team completed the project."`,
    `Domain: What are the most important skills for success in the ${category} sector?`,
  ];
}

function generateResumeTips(name: string, category: string): string[] {
  return [
    `Tailor your resume for ${name} by highlighting skills and experience most relevant to their open roles. Use keywords from the job description.`,
    `Keep your resume to one page, use clear headings, and include measurable achievements (e.g., "Improved efficiency by 20%") rather than just listing duties.`,
    `Proofread carefully for spelling and grammar errors. Many companies like ${name} use ATS software, so use a simple format without complex graphics or tables.`,
  ];
}

export function getPopularCompanies(category: string): string[] {
  return POPULAR_COMPANIES[category] ?? POPULAR_COMPANIES['All'];
}

export const COMPANY_CATEGORY_TABS = COMPANY_CATEGORIES;
