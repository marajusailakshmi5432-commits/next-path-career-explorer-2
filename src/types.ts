export interface Degree {
  id: string;
  name: string;
  category: string;
  skills: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  icon: string;
  skills: string[];
  degrees: string[];
  salary_lpa: string;
  role_type: string;
}

export interface Company {
  id: string;
  name: string;
  about: string;
  roles_available: string[];
  hiring_rounds: string[];
  prep_tip: string;
  sector: string;
}

export interface Course {
  id: string;
  title: string;
  platform: string;
  skill: string;
  difficulty: string;
  estimated_time: string;
  reason: string;
  is_free: boolean;
}

export interface CompanyDetails {
  name: string;
  about: string;
  roles_available: string[];
  hiring_rounds: string[];
  prep_tip: string;
  sector: string;
  isCustom: boolean;
}

export interface InterviewQuestion {
  id: string;
  target_type: string;
  target_name: string;
  question: string;
  sample_answer: string;
  sort_order: number;
}
