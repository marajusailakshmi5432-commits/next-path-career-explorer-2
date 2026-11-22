export interface JobMatch {
  title: string;
  description: string;
  icon: string;
  salaryRange: string;
  eligibility: string;
  whyMatches: string;
}

const STUDYING_OPTIONS = [
  '10th', 'Inter', 'Polytechnic', 'ITI', 'Degree', 'BTech',
  'After NEET', 'After JEE Mains', 'After EAMCET',
  'Govt Job Aspirant', 'Want to Study Abroad',
] as const;

const GENDER_OPTIONS = ['Boy', 'Girl', 'Prefer not to say'] as const;

const INTEREST_OPTIONS = [
  'Medical', 'Engineering', 'Machines', 'Computer', 'Teaching',
  'Air Hostess', 'Hotel Management', 'Chef', 'Business', 'Govt Job', 'Abroad',
] as const;

export { STUDYING_OPTIONS, GENDER_OPTIONS, INTEREST_OPTIONS };

// Icon name mapping for lucide-react
const ICON_MAP: Record<string, string> = {
  Medical: 'Stethoscope',
  Engineering: 'HardHat',
  Machines: 'Cog',
  Computer: 'MonitorSmartphone',
  Teaching: 'GraduationCap',
  'Air Hostess': 'Plane',
  'Hotel Management': 'BedDouble',
  Chef: 'ChefHat',
  Business: 'Briefcase',
  'Govt Job': 'Landmark',
  Abroad: 'Globe',
};

export function getInterestIcon(interest: string): string {
  return ICON_MAP[interest] ?? 'Compass';
}

export function getJobs(studying: string, gender: string, interest: string): JobMatch[] {
  const jobs: JobMatch[] = [];
  const lower = interest.toLowerCase();

  // Helper for gender-specific notes
  const genderNote = gender === 'Girl'
    ? 'Many organizations actively hire women for this role with special schemes and quotas.'
    : gender === 'Boy'
      ? 'This role has strong hiring opportunities across multiple industries.'
      : 'This role is open to all genders with equal opportunities.';

  if (lower === 'medical') {
    jobs.push({
      title: 'Doctor / MBBS',
      description: 'Diagnose and treat patients in hospitals or clinics. Requires MBBS degree and further specialization.',
      icon: 'Stethoscope', salaryRange: '6 - 20 LPA',
      eligibility: studying === 'After NEET' || studying === 'Inter' || studying === '12th' ? 'Eligible through NEET exam after Inter' : 'Requires NEET qualification — check if you can still apply',
      whyMatches: 'Your interest in Medical matches this core healthcare career path.',
    });
    jobs.push({
      title: 'Staff Nurse',
      description: 'Provide patient care in hospitals, monitor health, give medicines, and assist doctors.',
      icon: 'HeartPulse', salaryRange: '2.5 - 5 LPA',
      eligibility: studying === 'Degree' || studying === 'Inter' || studying === 'After NEET' ? 'Eligible after B.Sc Nursing or GNM diploma' : 'Can pursue nursing through B.Sc Nursing or diploma after current studies',
      whyMatches: 'Medical interest aligns with nursing — a high-demand healthcare role. ' + genderNote,
    });
    jobs.push({
      title: 'Pharmacist',
      description: 'Dispense medicines, advise patients on safe usage, and manage pharmacy inventory.',
      icon: 'Pill', salaryRange: '2.5 - 5 LPA',
      eligibility: studying === 'Degree' || studying === 'Polytechnic' || studying === 'Inter' ? 'Eligible after B.Pharmacy or D.Pharmacy' : 'Can pursue pharmacy after completing current studies',
      whyMatches: 'Medical interest connects to pharmacy — a stable healthcare career.',
    });
    jobs.push({
      title: 'Lab Technician',
      description: 'Conduct medical tests on patient samples and report results to help doctors diagnose.',
      icon: 'FlaskConical', salaryRange: '2 - 4.5 LPA',
      eligibility: studying === 'Degree' || studying === 'Inter' || studying === 'ITI' ? 'Eligible after B.Sc or diploma in medical lab technology' : 'Can pursue lab technology courses after current studies',
      whyMatches: 'Medical interest matches diagnostic lab work — growing demand in hospitals.',
    });
  }

  if (lower === 'engineering') {
    jobs.push({
      title: 'Software Engineer',
      description: 'Build and maintain software applications, websites, and mobile apps using programming.',
      icon: 'Code2', salaryRange: '3.5 - 12 LPA',
      eligibility: studying === 'BTech' || studying === 'After JEE Mains' || studying === 'After EAMCET' || studying === 'Degree' ? 'Eligible after BTech or BCA' : 'Can pursue engineering through JEE/EAMCET and BTech',
      whyMatches: 'Engineering interest with computer skills leads to software engineering — top paying career.',
    });
    jobs.push({
      title: 'Mechanical Engineer',
      description: 'Design, build, and test machines and mechanical systems for manufacturing and automotive industries.',
      icon: 'Cog', salaryRange: '3 - 7 LPA',
      eligibility: studying === 'BTech' || studying === 'Polytechnic' || studying === 'After EAMCET' ? 'Eligible after BTech or Polytechnic in Mechanical' : 'Can pursue mechanical engineering through EAMCET',
      whyMatches: 'Engineering interest matches mechanical — a core branch with strong industry demand.',
    });
    jobs.push({
      title: 'Civil Engineer',
      description: 'Plan and supervise construction of buildings, roads, bridges, and infrastructure projects.',
      icon: 'HardHat', salaryRange: '3 - 6 LPA',
      eligibility: studying === 'BTech' || studying === 'Polytechnic' || studying === 'After EAMCET' ? 'Eligible after BTech or Polytechnic in Civil' : 'Can pursue civil engineering through EAMCET',
      whyMatches: 'Engineering interest matches civil — infrastructure is always growing in India.',
    });
    jobs.push({
      title: 'Electrical Engineer',
      description: 'Design and maintain electrical systems, power distribution, and electronics for industries.',
      icon: 'Zap', salaryRange: '3 - 7 LPA',
      eligibility: studying === 'BTech' || studying === 'Polytechnic' || studying === 'ITI' ? 'Eligible after BTech, Polytechnic, or ITI in Electrical' : 'Can pursue electrical engineering through EAMCET or ITI',
      whyMatches: 'Engineering interest matches electrical — core field with government and private jobs.',
    });
  }

  if (lower === 'machines') {
    jobs.push({
      title: 'Mechanical Engineer',
      description: 'Design, build, and test machines and mechanical systems for manufacturing and automotive.',
      icon: 'Cog', salaryRange: '3 - 7 LPA',
      eligibility: studying === 'BTech' || studying === 'Polytechnic' || studying === 'After EAMCET' ? 'Eligible after BTech or Polytechnic in Mechanical' : 'Can pursue mechanical engineering or diploma',
      whyMatches: 'Your interest in machines directly matches mechanical engineering.',
    });
    jobs.push({
      title: 'ITI Technician',
      description: 'Operate, repair, and maintain machines and equipment in factories and workshops.',
      icon: 'Wrench', salaryRange: '1.5 - 4 LPA',
      eligibility: studying === 'ITI' || studying === '10th' || studying === 'Polytechnic' ? 'Eligible after ITI or 10th with trade course' : 'Can join ITI after 10th for machine-related trades',
      whyMatches: 'Machines interest with ITI is a perfect match — quick entry into technical jobs.',
    });
    jobs.push({
      title: 'CNC Operator',
      description: 'Program and operate computer-controlled machines to manufacture precision parts.',
      icon: 'Settings', salaryRange: '2 - 5 LPA',
      eligibility: studying === 'ITI' || studying === 'Polytechnic' || studying === '10th' ? 'Eligible after ITI or short CNC training course' : 'Can learn CNC operation through short-term courses',
      whyMatches: 'Machines interest matches CNC operation — high demand in manufacturing.',
    });
    jobs.push({
      title: 'Automobile Technician',
      description: 'Service and repair cars, bikes, and commercial vehicles at service centers.',
      icon: 'Car', salaryRange: '2 - 4.5 LPA',
      eligibility: studying === 'ITI' || studying === 'Polytechnic' || studying === '10th' ? 'Eligible after ITI in Automobile trade' : 'Can pursue automobile mechanic training after 10th',
      whyMatches: 'Machines interest connects to automobile service — always in demand.',
    });
  }

  if (lower === 'computer') {
    jobs.push({
      title: 'Software Engineer',
      description: 'Build and maintain software applications, websites, and mobile apps using programming.',
      icon: 'Code2', salaryRange: '3.5 - 12 LPA',
      eligibility: studying === 'BTech' || studying === 'Degree' || studying === 'After JEE Mains' || studying === 'After EAMCET' ? 'Eligible after BTech, BCA, or MCA' : 'Can learn coding through bootcamps or degree and enter IT',
      whyMatches: 'Computer interest is the core skill for software engineering — highest paying field.',
    });
    jobs.push({
      title: 'Data Analyst',
      description: 'Analyze data and create reports to help companies make smart business decisions.',
      icon: 'BarChart3', salaryRange: '3 - 7 LPA',
      eligibility: studying === 'BTech' || studying === 'Degree' || studying === 'After EAMCET' ? 'Eligible after any degree with data skills' : 'Can learn data analysis through online courses after current studies',
      whyMatches: 'Computer interest with analytical thinking fits data analysis — fast growing field.',
    });
    jobs.push({
      title: 'Web Developer',
      description: 'Build websites and web applications using HTML, CSS, JavaScript, and frameworks.',
      icon: 'Globe', salaryRange: '2.5 - 8 LPA',
      eligibility: studying === 'BTech' || studying === 'Degree' || studying === 'ITI' || studying === '10th' ? 'Eligible — web development can be learned by anyone' : 'Can learn web development through free online courses',
      whyMatches: 'Computer interest directly matches web development — easy to learn and start freelancing.',
    });
    jobs.push({
      title: 'IT Support Technician',
      description: 'Install, configure, and troubleshoot computer systems and networks in offices.',
      icon: 'MonitorSmartphone', salaryRange: '2.5 - 5 LPA',
      eligibility: studying === 'ITI' || studying === 'Polytechnic' || studying === 'Degree' || studying === 'BTech' ? 'Eligible after ITI, diploma, or degree with computer skills' : 'Can learn IT support through short courses',
      whyMatches: 'Computer interest matches IT support — entry-level IT role with growth potential.',
    });
  }

  if (lower === 'teaching') {
    jobs.push({
      title: 'School Teacher',
      description: 'Teach students in schools — subjects like Maths, Science, English, or Social Studies.',
      icon: 'GraduationCap', salaryRange: '2.5 - 6 LPA',
      eligibility: studying === 'Degree' || studying === 'Inter' || studying === 'BTech' ? 'Eligible after Degree + B.Ed or D.El.Ed' : 'Can complete degree and B.Ed to become a teacher',
      whyMatches: 'Teaching interest is a perfect match — stable and respected career. ' + genderNote,
    });
    jobs.push({
      title: 'College Lecturer',
      description: 'Teach specialized subjects to college students and guide their academic projects.',
      icon: 'BookOpen', salaryRange: '4 - 10 LPA',
      eligibility: studying === 'BTech' || studying === 'Degree' ? 'Eligible after Masters + NET/SET exam' : 'Can pursue PG and NET to become a lecturer',
      whyMatches: 'Teaching interest at higher level — good salary and academic environment.',
    });
    jobs.push({
      title: 'Online Tutor',
      description: 'Teach students online through platforms — flexible hours, work from home.',
      icon: 'Laptop', salaryRange: '2 - 6 LPA',
      eligibility: studying === 'Inter' || studying === 'Degree' || studying === 'BTech' ? 'Eligible — anyone with good subject knowledge can start' : 'Can start tutoring after gaining subject expertise',
      whyMatches: 'Teaching interest with online tutoring — flexible and growing fast in India.',
    });
    jobs.push({
      title: 'Coaching Instructor',
      description: 'Teach competitive exam preparation at coaching institutes for NEET, JEE, or banking.',
      icon: 'Presentation', salaryRange: '3 - 8 LPA',
      eligibility: studying === 'BTech' || studying === 'After NEET' || studying === 'After JEE Mains' || studying === 'Degree' ? 'Eligible — strong subject knowledge is key' : 'Can gain expertise and teach at coaching centers',
      whyMatches: 'Teaching interest with exam prep experience fits coaching instructor role.',
    });
  }

  if (lower === 'air hostess') {
    jobs.push({
      title: 'Air Hostess / Cabin Crew',
      description: 'Welcome passengers, ensure safety, serve food, and make flights comfortable.',
      icon: 'Plane', salaryRange: '3 - 8 LPA',
      eligibility: studying === 'Inter' || studying === 'Degree' || studying === '12th' ? 'Eligible after Inter (12th) with height and fitness requirements' : 'Can complete Inter and apply for cabin crew training',
      whyMatches: 'Air Hostess interest is a direct match — glamorous and well-paying career. ' + genderNote,
    });
    jobs.push({
      title: 'Ground Staff',
      description: 'Manage check-in, baggage, and passenger services at airports.',
      icon: 'Luggage', salaryRange: '2.5 - 5 LPA',
      eligibility: studying === 'Inter' || studying === 'Degree' || studying === 'ITI' ? 'Eligible after Inter or Degree with communication skills' : 'Can complete Inter and join airport ground staff training',
      whyMatches: 'Air Hostess interest connects to ground staff — aviation industry entry point.',
    });
    jobs.push({
      title: 'Flight Attendant (International)',
      description: 'Serve on international flights — higher pay, travel the world, premium service.',
      icon: 'Plane', salaryRange: '5 - 15 LPA',
      eligibility: studying === 'Degree' || studying === 'Inter' ? 'Eligible after Degree with fluency in English' : 'Can complete degree and apply for international airlines',
      whyMatches: 'Air Hostess interest at international level — top tier of cabin crew careers.',
    });
  }

  if (lower === 'hotel management') {
    jobs.push({
      title: 'Hotel Manager',
      description: 'Manage hotel operations, staff, guest services, and ensure great guest experiences.',
      icon: 'BedDouble', salaryRange: '3 - 8 LPA',
      eligibility: studying === 'Degree' || studying === 'Inter' || studying === 'Polytechnic' ? 'Eligible after BHM or hotel management diploma' : 'Can pursue hotel management degree or diploma',
      whyMatches: 'Hotel Management interest is a direct match — growing hospitality sector in India.',
    });
    jobs.push({
      title: 'Front Office Executive',
      description: 'Welcome guests, manage check-ins and bookings, handle customer queries at hotels.',
      icon: 'BellRing', salaryRange: '2 - 4.5 LPA',
      eligibility: studying === 'Inter' || studying === 'Degree' ? 'Eligible after Inter with communication skills' : 'Can complete Inter and join front office training',
      whyMatches: 'Hotel Management interest connects to front office — guest-facing role.',
    });
    jobs.push({
      title: 'Event Manager',
      description: 'Plan and manage weddings, conferences, and events at hotels and venues.',
      icon: 'PartyPopper', salaryRange: '3 - 7 LPA',
      eligibility: studying === 'Degree' || studying === 'Inter' ? 'Eligible after Degree or with event management certificate' : 'Can pursue event management courses after current studies',
      whyMatches: 'Hotel Management interest fits event management — creative and dynamic career.',
    });
  }

  if (lower === 'chef') {
    jobs.push({
      title: 'Chef / Cook',
      description: 'Prepare delicious dishes in restaurants, hotels, or cruise ships using culinary skills.',
      icon: 'ChefHat', salaryRange: '2.5 - 10 LPA',
      eligibility: studying === 'Inter' || studying === 'Degree' || studying === 'ITI' || studying === '10th' ? 'Eligible — can start after 10th with culinary courses' : 'Can join culinary arts courses after current studies',
      whyMatches: 'Chef interest is a direct match — creative and in-demand career worldwide.',
    });
    jobs.push({
      title: 'Pastry Chef',
      description: 'Specialize in baking cakes, pastries, desserts, and breads for bakeries and hotels.',
      icon: 'Cake', salaryRange: '2.5 - 6 LPA',
      eligibility: studying === 'Inter' || studying === 'Degree' || studying === '10th' ? 'Eligible — can specialize through baking courses' : 'Can learn baking and pastry through short courses',
      whyMatches: 'Chef interest with sweet specialization — growing demand in bakeries and cafes.',
    });
    jobs.push({
      title: 'Restaurant Manager',
      description: 'Manage restaurant operations, staff, food quality, and customer satisfaction.',
      icon: 'UtensilsCrossed', salaryRange: '3 - 7 LPA',
      eligibility: studying === 'Degree' || studying === 'Inter' ? 'Eligible after hotel management or degree' : 'Can gain restaurant experience and move into management',
      whyMatches: 'Chef interest with management skills fits restaurant manager role.',
    });
  }

  if (lower === 'business') {
    jobs.push({
      title: 'Business Analyst',
      description: 'Analyze business needs, gather requirements, and help companies improve processes.',
      icon: 'Briefcase', salaryRange: '3.5 - 9 LPA',
      eligibility: studying === 'BTech' || studying === 'Degree' || studying === 'After EAMCET' ? 'Eligible after any degree with analytical skills' : 'Can pursue degree and develop business analysis skills',
      whyMatches: 'Business interest matches analyst role — bridge between business and technology.',
    });
    jobs.push({
      title: 'Sales & Marketing Executive',
      description: 'Sell products and create marketing strategies to grow business and reach customers.',
      icon: 'Target', salaryRange: '2.5 - 8 LPA',
      eligibility: studying === 'Degree' || studying === 'Inter' || studying === 'BTech' || studying === 'Any' ? 'Eligible after any degree or even Inter for entry roles' : 'Can enter sales with communication skills after current studies',
      whyMatches: 'Business interest directly matches sales and marketing — core of every company.',
    });
    jobs.push({
      title: 'Entrepreneur / Startup Founder',
      description: 'Start your own business — from small shop to tech startup — and build it from scratch.',
      icon: 'Rocket', salaryRange: 'Unlimited',
      eligibility: 'No specific degree required — anyone with an idea and drive can start',
      whyMatches: 'Business interest is the foundation of entrepreneurship — be your own boss.',
    });
    jobs.push({
      title: 'HR Manager',
      description: 'Manage hiring, employee relations, and company culture to build strong teams.',
      icon: 'Users', salaryRange: '3 - 8 LPA',
      eligibility: studying === 'Degree' || studying === 'BTech' ? 'Eligible after degree with HR skills' : 'Can pursue MBA or HR courses after degree',
      whyMatches: 'Business interest with people skills fits HR management — key role in every company.',
    });
  }

  if (lower === 'govt job') {
    jobs.push({
      title: 'Bank PO / Clerk',
      description: 'Work in government banks — manage accounts, customer services, and banking operations.',
      icon: 'Landmark', salaryRange: '3 - 8 LPA',
      eligibility: studying === 'Degree' || studying === 'BTech' || studying === 'Govt Job Aspirant' ? 'Eligible after any degree — pass IBPS/SBI exam' : 'Can complete degree and prepare for bank exams',
      whyMatches: 'Govt Job interest matches banking — stable, respected, and good salary.',
    });
    jobs.push({
      title: 'SSC / UPSC Officer',
      description: 'Serve in government departments — administration, revenue, defence, and more.',
      icon: 'FileText', salaryRange: '4 - 12 LPA',
      eligibility: studying === 'Degree' || studying === 'BTech' || studying === 'Govt Job Aspirant' ? 'Eligible after any degree — pass SSC or UPSC exam' : 'Can complete degree and prepare for civil services',
      whyMatches: 'Govt Job interest is a direct match — most prestigious government career path.',
    });
    jobs.push({
      title: 'Railway Job',
      description: 'Work in Indian Railways — from station master to technical roles across India.',
      icon: 'Train', salaryRange: '2.5 - 7 LPA',
      eligibility: studying === 'ITI' || studying === 'Inter' || studying === 'Degree' || studying === 'Govt Job Aspirant' ? 'Eligible after 10th/Inter/ITI/Degree depending on post' : 'Can prepare for RRB exams after current studies',
      whyMatches: 'Govt Job interest matches railways — lakhs of vacancies every year.',
    });
    jobs.push({
      title: 'Police / Defence',
      description: 'Serve in police force or military — protect the nation and maintain law and order.',
      icon: 'Shield', salaryRange: '3 - 7 LPA',
      eligibility: studying === 'Inter' || studying === 'Degree' || studying === '10th' || studying === 'Govt Job Aspirant' ? 'Eligible after Inter or 10th — physical fitness required' : 'Can complete Inter and apply for police/defence recruitment',
      whyMatches: 'Govt Job interest with service mindset fits police and defence. ' + genderNote,
    });
  }

  if (lower === 'abroad') {
    jobs.push({
      title: 'Study Abroad — MS / MTech',
      description: 'Pursue masters abroad in USA, UK, Canada, or Australia for global career opportunities.',
      icon: 'Globe', salaryRange: '$40K - $120K',
      eligibility: studying === 'BTech' || studying === 'Degree' || studying === 'After JEE Mains' ? 'Eligible after BTech/Degree with GRE/IELTS/TOEFL' : 'Can complete degree, take GRE/IELTS, and apply abroad',
      whyMatches: 'Abroad interest matches higher studies overseas — global exposure and high salary.',
    });
    jobs.push({
      title: 'Work Abroad — IT Professional',
      description: 'Work as a software engineer in foreign companies through onsite or direct hiring.',
      icon: 'Code2', salaryRange: '$50K - $150K',
      eligibility: studying === 'BTech' || studying === 'Degree' || studying === 'After EAMCET' ? 'Eligible after BTech with strong coding + English skills' : 'Can learn coding, build experience, and apply for abroad IT jobs',
      whyMatches: 'Abroad interest with IT skills — most common path to work overseas.',
    });
    jobs.push({
      title: 'Nursing Abroad',
      description: 'Work as a nurse in UK, Canada, Australia, or Gulf countries — huge demand.',
      icon: 'HeartPulse', salaryRange: '$30K - $70K',
      eligibility: studying === 'After NEET' || studying === 'Degree' || studying === 'Inter' ? 'Eligible after B.Sc Nursing + IELTS/OET' : 'Can complete nursing and pass language exams for abroad',
      whyMatches: 'Abroad interest in healthcare — nursing has massive global demand. ' + genderNote,
    });
    jobs.push({
      title: 'PR / Immigration Pathway',
      description: 'Move to Canada, Australia, or New Zealand through skilled worker immigration programs.',
      icon: 'Plane', salaryRange: 'Varies by country',
      eligibility: studying === 'BTech' || studying === 'Degree' || studying === 'Polytechnic' || studying === 'ITI' ? 'Eligible — points based on age, education, experience, and language' : 'Can build qualifications and work experience to qualify for PR',
      whyMatches: 'Abroad interest matches permanent residency — long-term settlement option.',
    });
  }

  // Fallback: always return at least something
  if (jobs.length === 0) {
    jobs.push({
      title: 'General Career Options',
      description: 'Based on your selections, explore various career paths that match your background.',
      icon: 'Compass', salaryRange: 'Varies',
      eligibility: 'Check specific courses and exams for your field of interest',
      whyMatches: 'Your selections show multiple possible career directions — explore and choose what excites you.',
    });
  }

  return jobs.slice(0, 4);
}

export function getCareerPath(studying: string, interest: string): string {
  const paths: Record<string, Record<string, string>> = {
    Medical: {
      '10th': 'Complete Inter (MPC/BiPC) → Write NEET → MBBS or B.Sc Nursing → Doctor/Nurse',
      Inter: 'Write NEET exam → MBBS (5.5 yrs) or B.Sc Nursing → Doctor / Nurse / Pharmacist',
      'After NEET': 'Based on NEET rank → MBBS/BDS or Allied Health → Doctor / Specialist',
      BTech: 'Switch to healthcare through B.Sc Nursing, Pharmacy, or hospital management',
      Degree: 'Pursue B.Sc Nursing, B.Pharmacy, or M.Sc → Nurse / Pharmacist / Lab Technician',
    },
    Engineering: {
      '10th': 'Complete Inter (MPC) → Write JEE/EAMCET → BTech → Engineer',
      Inter: 'Write JEE Mains or EAMCET → BTech (4 yrs) → Software / Mechanical / Civil Engineer',
      'After JEE Mains': 'Based on JEE rank → BTech in top college → Engineer',
      'After EAMCET': 'Based on EAMCET rank → BTech in AP/TS college → Engineer',
      BTech: 'Already in BTech → Choose specialization → Engineer / Higher studies',
      Polytechnic: 'Complete diploma → Direct 2nd year BTech or start job → Junior Engineer',
    },
    Computer: {
      '10th': 'Complete Inter → Learn coding → BTech/BCA or bootcamp → Software Engineer',
      Inter: 'Pursue BTech/BCA or learn coding online → Software / Web Developer',
      Degree: 'Learn coding through courses → Software Engineer / Data Analyst',
      ITI: 'Learn computer basics + coding → IT Support / Web Developer',
      BTech: 'Already in BTech → Build projects → Software Engineer at top companies',
    },
    'Air Hostess': {
      '10th': 'Complete Inter → Join cabin crew training → Air Hostess',
      Inter: 'Join air hostess training institute (6-12 months) → Air Hostess',
      Degree: 'Apply directly to airlines → Air Hostess / Ground Staff',
    },
  };

  return paths[interest]?.[studying] ?? 'Complete your current studies → Pursue relevant courses or exams → Start your career in your interest area';
}
