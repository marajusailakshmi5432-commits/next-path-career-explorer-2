/*
# NexPath Universal v3: Full platform upgrade

Rebuilds the database for a universal career platform serving ALL students:
IT, Non-IT, B.Tech, B.Com, BBA, MBA, B.Sc, BA, Pharmacy, Nursing, Agriculture,
Hotel Management, Law, CA, Diploma, ITI, and 10th/12th Pass.

Changes:
1. Replace `backgrounds` with `degrees` (30+ degrees, each with relevant skills)
2. Expand `roles` to 21 IT + Non-IT roles (add Healthcare, Hotel, Law, Agriculture roles)
3. Expand `companies` to 28 companies (add Healthcare, Govt/PSU, Pharma, Retail)
4. Add `interview_questions` table (role-based + company-based Q&A with sample answers)
5. Keep `courses` table (add is_free already present)

All existing tables contain only reference/seed data — safe to drop and recreate.
*/

DROP TABLE IF EXISTS interview_questions CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS backgrounds CASCADE;

-- ============================================================
-- DEGREES TABLE (30+ degrees)
-- ============================================================
CREATE TABLE degrees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  skills text[] NOT NULL DEFAULT '{}'
);

ALTER TABLE degrees ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON degrees TO anon, authenticated;
CREATE POLICY "anon_select_degrees" ON degrees FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- ROLES TABLE (21 roles)
-- ============================================================
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Briefcase',
  skills text[] NOT NULL DEFAULT '{}',
  degrees text[] NOT NULL DEFAULT '{}',
  salary_lpa text NOT NULL,
  role_type text NOT NULL DEFAULT 'IT'
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON roles TO anon, authenticated;
CREATE POLICY "anon_select_roles" ON roles FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- COMPANIES TABLE (28 companies)
-- ============================================================
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  about text NOT NULL,
  roles_available text[] NOT NULL DEFAULT '{}',
  hiring_rounds text[] NOT NULL DEFAULT '{}',
  prep_tip text NOT NULL,
  sector text NOT NULL DEFAULT 'IT'
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON companies TO anon, authenticated;
CREATE POLICY "anon_select_companies" ON companies FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- COURSES TABLE (18+ courses)
-- ============================================================
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  platform text NOT NULL,
  skill text NOT NULL,
  difficulty text NOT NULL,
  estimated_time text NOT NULL,
  reason text NOT NULL,
  is_free boolean NOT NULL DEFAULT true
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON courses TO anon, authenticated;
CREATE POLICY "anon_select_courses" ON courses FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- INTERVIEW QUESTIONS TABLE
-- ============================================================
CREATE TABLE interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL,
  target_name text NOT NULL,
  question text NOT NULL,
  sample_answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON interview_questions TO anon, authenticated;
CREATE POLICY "anon_select_iq" ON interview_questions FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- SEED: DEGREES (32 degrees)
-- ============================================================
INSERT INTO degrees (name, category, skills) VALUES
('B.Tech (Computer Science)', 'IT & Engineering', ARRAY['Python','Java','SQL','HTML/CSS','JavaScript','React','Problem Solving','Communication']),
('B.Tech (Electronics)', 'IT & Engineering', ARRAY['Python','Communication','Problem Solving','MS Excel','Teamwork','Analytical Thinking']),
('B.Tech (Mechanical)', 'Core Engineering', ARRAY['AutoCAD','Problem Solving','Communication','MS Excel','Leadership','Teamwork']),
('B.Tech (Civil)', 'Core Engineering', ARRAY['AutoCAD','Problem Solving','Communication','MS Excel','Leadership','Teamwork']),
('B.Tech (Electrical)', 'Core Engineering', ARRAY['Problem Solving','Communication','MS Excel','Leadership','Teamwork','Python']),
('M.Tech', 'IT & Engineering', ARRAY['Python','Problem Solving','Communication','Research','Analytical Thinking','Leadership']),
('BCA', 'IT & Engineering', ARRAY['Python','Java','SQL','HTML/CSS','JavaScript','Problem Solving','Communication']),
('MCA', 'IT & Engineering', ARRAY['Python','Java','SQL','JavaScript','React','Problem Solving','Communication']),
('B.Com', 'Commerce & Finance', ARRAY['Tally & Accounting','MS Excel','SQL','Communication','Customer Support','Data Entry','Analytical Thinking']),
('M.Com', 'Commerce & Finance', ARRAY['Tally & Accounting','MS Excel','SQL','Communication','Analytical Thinking','Leadership']),
('BBA', 'Commerce & Management', ARRAY['Communication','MS Excel','Leadership','Sales & Marketing','Customer Support','Teamwork','Time Management']),
('MBA', 'Commerce & Management', ARRAY['Communication','Leadership','MS Excel','Sales & Marketing','Analytical Thinking','Problem Solving','Teamwork']),
('CA', 'Commerce & Finance', ARRAY['Tally & Accounting','MS Excel','Analytical Thinking','Communication','Problem Solving','Leadership']),
('B.Sc (Computer Science)', 'IT & Science', ARRAY['Python','SQL','MS Excel','Problem Solving','Communication','Analytical Thinking']),
('B.Sc (Mathematics)', 'IT & Science', ARRAY['Analytical Thinking','Problem Solving','MS Excel','Python','Communication']),
('B.Sc (Nursing)', 'Healthcare', ARRAY['Patient Care','Communication','Teamwork','Time Management','Problem Solving','Empathy']),
('B.Pharmacy', 'Healthcare & Pharma', ARRAY['Pharmacy Knowledge','Communication','Customer Support','MS Excel','Sales & Marketing','Teamwork']),
('D.Pharmacy', 'Healthcare & Pharma', ARRAY['Pharmacy Knowledge','Communication','Customer Support','MS Excel','Sales & Marketing']),
('B.Agriculture', 'Agriculture', ARRAY['Agriculture Knowledge','Problem Solving','Communication','MS Excel','Teamwork','Leadership']),
('B.Sc (Agriculture)', 'Agriculture', ARRAY['Agriculture Knowledge','Problem Solving','Communication','MS Excel','Teamwork','Leadership']),
('B.Hotel Management', 'Hospitality', ARRAY['Communication','Customer Support','Teamwork','Leadership','Time Management','Sales & Marketing']),
('Diploma in Hotel Management', 'Hospitality', ARRAY['Communication','Customer Support','Teamwork','Time Management','Leadership']),
('LLB / Law', 'Law', ARRAY['Communication','Analytical Thinking','Problem Solving','Research','Writing','Time Management']),
('BA', 'Arts & Humanities', ARRAY['Communication','Content Writing','Digital Marketing','Sales & Marketing','MS Excel','Customer Support','Leadership']),
('MA', 'Arts & Humanities', ARRAY['Communication','Content Writing','Leadership','Analytical Thinking','Research','Writing']),
('Diploma (Engineering)', 'Core Engineering', ARRAY['AutoCAD','Problem Solving','Communication','MS Excel','Teamwork','Data Entry']),
('ITI', 'Core Engineering', ARRAY['Problem Solving','Communication','Teamwork','Time Management','Data Entry','Customer Support']),
('12th Pass', 'School Pass', ARRAY['Communication','Customer Support','Data Entry','MS Excel','Sales & Marketing','Teamwork','Time Management']),
('10th Pass', 'School Pass', ARRAY['Communication','Customer Support','Data Entry','Teamwork','Time Management']),
('Any Degree', 'General', ARRAY['Communication','MS Excel','Customer Support','Data Entry','Sales & Marketing','Teamwork','Time Management','Problem Solving']),
('B.Sc (General)', 'IT & Science', ARRAY['Python','SQL','MS Excel','Communication','Problem Solving','Analytical Thinking']),
('Diploma in Computer Science', 'IT & Engineering', ARRAY['Python','Java','SQL','HTML/CSS','Problem Solving','Communication']);

-- ============================================================
-- SEED: ROLES (21 roles)
-- ============================================================
INSERT INTO roles (name, description, icon, skills, degrees, salary_lpa, role_type) VALUES
('Software Engineer', 'Builds and maintains software applications, websites, and mobile apps using programming languages.', 'Code2', ARRAY['Python','Java','SQL','HTML/CSS','JavaScript','React','Problem Solving','Communication'], ARRAY['B.Tech (Computer Science)','BCA','MCA','M.Tech','B.Sc (Computer Science)','Diploma in Computer Science'], '3.5 - 8 LPA', 'IT'),
('Data Analyst', 'Collects, cleans, and studies data to help companies make better business decisions.', 'BarChart3', ARRAY['Python','SQL','MS Excel','Communication','Problem Solving','Analytical Thinking'], ARRAY['B.Tech (Computer Science)','B.Sc (Computer Science)','B.Com','MBA','M.Com','B.Sc (General)','B.Sc (Mathematics)'], '3 - 7 LPA', 'IT'),
('Financial Analyst', 'Reviews financial data, prepares reports, and helps companies plan their budgets and investments.', 'TrendingUp', ARRAY['Tally & Accounting','MS Excel','SQL','Communication','Analytical Thinking'], ARRAY['B.Com','BBA','MBA','M.Com','CA'], '3 - 6 LPA', 'Non-IT'),
('HR Recruiter', 'Finds, interviews, and hires the right people for open roles in a company.', 'Users', ARRAY['Communication','MS Excel','Customer Support','Leadership','Teamwork'], ARRAY['B.Com','BBA','BA','MBA','Any Degree','MA'], '2.5 - 5 LPA', 'Non-IT'),
('Digital Marketing Executive', 'Promotes products and brands online using social media, ads, and content to reach more customers.', 'Megaphone', ARRAY['Digital Marketing','Content Writing','Communication','Sales & Marketing','MS Excel'], ARRAY['BBA','BA','B.Com','MBA','Any Degree','MA'], '2.5 - 6 LPA', 'Non-IT'),
('Bank Associate', 'Helps customers with banking services, account opening, and basic financial transactions at a bank branch.', 'Landmark', ARRAY['Communication','Customer Support','MS Excel','Data Entry','Tally & Accounting'], ARRAY['B.Com','BBA','B.Sc (General)','Any Degree','12th Pass'], '2 - 4.5 LPA', 'Non-IT'),
('Mechanical Engineer', 'Designs, builds, and tests mechanical systems and machines for manufacturing and automotive industries.', 'Cog', ARRAY['AutoCAD','Problem Solving','Communication','MS Excel','Leadership','Teamwork'], ARRAY['B.Tech (Mechanical)','Diploma (Engineering)','M.Tech','ITI'], '3 - 7 LPA', 'Non-IT'),
('Operations Executive', 'Manages day-to-day business operations, coordinates between teams, and ensures work gets done on time.', 'ClipboardList', ARRAY['Communication','MS Excel','Data Entry','Leadership','Teamwork','Time Management'], ARRAY['B.Com','BBA','BA','B.Sc (General)','MBA','Any Degree','B.Hotel Management'], '2.5 - 5 LPA', 'Non-IT'),
('Customer Support Executive', 'Helps customers solve problems and answers questions over phone, chat, or email.', 'Headphones', ARRAY['Communication','Customer Support','Data Entry','MS Excel','Teamwork','Time Management'], ARRAY['Any Degree','12th Pass','B.Com','BA','B.Sc (General)','10th Pass','Diploma in Hotel Management'], '2 - 4 LPA', 'Non-IT'),
('Content Writer', 'Writes articles, blogs, and marketing content that informs and engages readers online.', 'PenLine', ARRAY['Content Writing','Communication','Digital Marketing','MS Excel','Time Management'], ARRAY['BA','BBA','B.Com','MA','Any Degree','LLB / Law'], '2.5 - 5 LPA', 'Non-IT'),
('Sales & Marketing Executive', 'Sells products or services to customers and creates marketing strategies to grow the business.', 'Target', ARRAY['Sales & Marketing','Communication','Customer Support','Leadership','MS Excel'], ARRAY['BBA','B.Com','BA','MBA','Any Degree','B.Pharmacy'], '2.5 - 6 LPA', 'Non-IT'),
('Data Entry Operator', 'Types and organizes information into computer systems and spreadsheets accurately and quickly.', 'Keyboard', ARRAY['Data Entry','MS Excel','Communication','Time Management'], ARRAY['Any Degree','12th Pass','Diploma (Engineering)','B.Com','10th Pass','ITI'], '1.5 - 3 LPA', 'Non-IT'),
('Pharmacist', 'Dispenses medicines, advises patients on safe usage, and manages pharmacy inventory at hospitals or medical stores.', 'Pill', ARRAY['Pharmacy Knowledge','Communication','Customer Support','MS Excel','Teamwork'], ARRAY['B.Pharmacy','D.Pharmacy'], '2.5 - 5 LPA', 'Non-IT'),
('Staff Nurse', 'Provides patient care in hospitals and clinics, monitors health, gives medicines, and assists doctors.', 'HeartPulse', ARRAY['Patient Care','Communication','Teamwork','Time Management','Problem Solving'], ARRAY['B.Sc (Nursing)'], '2.5 - 5 LPA', 'Non-IT'),
('Hotel Front Office Executive', 'Welcomes hotel guests, manages check-ins and check-outs, and handles bookings and customer queries.', 'BedDouble', ARRAY['Communication','Customer Support','MS Excel','Teamwork','Leadership','Time Management'], ARRAY['B.Hotel Management','Diploma in Hotel Management','Any Degree','BA'], '2 - 4.5 LPA', 'Non-IT'),
('Agriculture Field Officer', 'Guides farmers on modern farming techniques, crop planning, and government agricultural schemes.', 'Sprout', ARRAY['Agriculture Knowledge','Communication','Problem Solving','MS Excel','Teamwork','Leadership'], ARRAY['B.Agriculture','B.Sc (Agriculture)'], '2.5 - 5 LPA', 'Non-IT'),
('Legal Assistant', 'Helps lawyers by drafting documents, researching cases, and organizing legal files and records.', 'Scale', ARRAY['Communication','Writing','Research','Analytical Thinking','Time Management'], ARRAY['LLB / Law','BA','MA'], '3 - 6 LPA', 'Non-IT'),
('Accountant', 'Records daily financial transactions, maintains ledgers, and prepares financial statements for businesses.', 'Calculator', ARRAY['Tally & Accounting','MS Excel','SQL','Communication','Analytical Thinking'], ARRAY['B.Com','M.Com','CA','BBA'], '2.5 - 5 LPA', 'Non-IT'),
('Civil Site Engineer', 'Supervises construction sites, checks building plans, and ensures construction work meets safety standards.', 'HardHat', ARRAY['AutoCAD','Problem Solving','Communication','MS Excel','Leadership','Teamwork'], ARRAY['B.Tech (Civil)','Diploma (Engineering)'], '3 - 6 LPA', 'Non-IT'),
('Marketing Manager', 'Plans and leads marketing campaigns, manages a team, and grows the brand and sales of a company.', 'Megaphone', ARRAY['Leadership','Communication','Sales & Marketing','Digital Marketing','MS Excel','Analytical Thinking'], ARRAY['MBA','BBA','BA','MA'], '5 - 12 LPA', 'Non-IT'),
('IT Support Technician', 'Installs, configures, and troubleshoots computer systems and networks to keep office technology running smoothly.', 'MonitorSmartphone', ARRAY['Problem Solving','Communication','Python','MS Excel','Teamwork','Customer Support'], ARRAY['BCA','B.Tech (Computer Science)','Diploma in Computer Science','B.Sc (Computer Science)','ITI','Any Degree'], '2.5 - 5 LPA', 'IT');

-- ============================================================
-- SEED: COMPANIES (28 companies)
-- ============================================================
INSERT INTO companies (name, about, roles_available, hiring_rounds, prep_tip, sector) VALUES
-- IT / Tech (8)
('TCS', 'One of India''s largest IT companies, building software and providing tech services to businesses worldwide.', ARRAY['Software Engineer','Data Analyst','Operations Executive','Customer Support Executive'], ARRAY['Aptitude Test','Technical Interview','HR Round'], 'Practice basic aptitude questions and revise your core subjects. Be ready to explain your college project simply.', 'IT'),
('Infosys', 'A global IT consulting company that helps businesses with digital transformation, software development, and cloud services.', ARRAY['Software Engineer','Data Analyst','Operations Executive'], ARRAY['Online Assessment','Technical Interview','HR Round'], 'Brush up on one programming language and practice speaking out loud about your projects and skills.', 'IT'),
('Zoho', 'A product-based IT company that builds a wide suite of cloud-based business, productivity, and collaboration software tools.', ARRAY['Software Engineer','Data Analyst','Content Writer','Customer Support Executive'], ARRAY['Coding Test','Technical Interview','Managerial Round','HR Round'], 'Focus on data structures, practice coding problems, and be ready to explain your thinking step by step.', 'IT'),
('Amazon', 'A global e-commerce and cloud computing leader, running online retail, logistics, and AWS cloud services worldwide.', ARRAY['Software Engineer','Data Analyst','Operations Executive','Customer Support Executive','Content Writer'], ARRAY['Online Assessment','Technical Interview 1','Technical Interview 2','HR Round'], 'Practice problem-solving and coding basics. For non-tech roles, prepare examples of handling real situations.', 'IT'),
('Flipkart', 'One of India''s leading e-commerce platforms, selling everything from electronics to fashion to millions of customers.', ARRAY['Operations Executive','Data Analyst','Customer Support Executive','Digital Marketing Executive','Content Writer'], ARRAY['Online Assessment','Case Study Round','Personal Interview','HR Round'], 'Understand how e-commerce works, think about customer needs, and practice solving simple case study problems.', 'IT'),
('Wipro', 'A global technology and business services company delivering IT solutions, cloud services, and engineering support to clients worldwide.', ARRAY['Software Engineer','Data Analyst','IT Support Technician','Operations Executive'], ARRAY['Aptitude Test','Technical Interview','HR Round'], 'Solve previous year aptitude papers and prepare two strong project explanations for the interview.', 'IT'),
('HCL Technologies', 'A major IT services company providing software development, infrastructure management, and engineering R&D services globally.', ARRAY['Software Engineer','IT Support Technician','Data Analyst','Customer Support Executive'], ARRAY['Online Assessment','Technical Interview','HR Round'], 'Revise core programming concepts and be ready to solve simple coding problems on the spot.', 'IT'),
('Tech Mahindra', 'A leading IT services and consulting company specializing in digital transformation, networking, and enterprise solutions.', ARRAY['Software Engineer','Data Analyst','Operations Executive','Customer Support Executive'], ARRAY['Aptitude Test','Technical Interview','HR Round'], 'Practice aptitude and coding basics, and prepare clear answers about your academic projects.', 'IT'),
-- Core Engineering (4)
('L&T', 'A major engineering and construction company that builds infrastructure, power plants, and heavy industrial projects across India.', ARRAY['Mechanical Engineer','Civil Site Engineer','Operations Executive','Data Analyst'], ARRAY['Aptitude Test','Technical Interview','HR Round'], 'Revise core engineering basics and be ready to discuss how you would solve real-world site or design problems.', 'Core'),
('Tata Motors', 'India''s largest automotive company, manufacturing cars, trucks, and buses sold across India and internationally.', ARRAY['Mechanical Engineer','Operations Executive','Sales & Marketing Executive','Customer Support Executive'], ARRAY['Aptitude Test','Technical Interview','HR Round'], 'Learn about their vehicle lineup, brush up on basic engineering or sales concepts, and show enthusiasm for automobiles.', 'Core'),
('BHEL', 'A government-owned engineering company that manufactures power plant equipment and heavy electrical machinery for India''s energy sector.', ARRAY['Mechanical Engineer','Civil Site Engineer','Operations Executive','IT Support Technician'], ARRAY['GATE Score / Written Test','Technical Interview','HR Round'], 'Prepare for GATE-based selection or written technical test, and revise core mechanical/electrical subjects thoroughly.', 'Core'),
('Siemens', 'A global technology company focused on industrial automation, electrification, and digital solutions for manufacturing and infrastructure.', ARRAY['Mechanical Engineer','Civil Site Engineer','Software Engineer','Operations Executive'], ARRAY['Online Assessment','Technical Interview','HR Round'], 'Learn about industrial automation basics and be ready to discuss how technology applies to engineering.', 'Core'),
-- Finance & Consulting (4)
('HDFC Bank', 'One of India''s biggest private banks, offering savings accounts, loans, credit cards, and investment services to millions.', ARRAY['Bank Associate','Customer Support Executive','Operations Executive','Financial Analyst','Accountant'], ARRAY['Aptitude Test','Personal Interview','HR Round'], 'Learn basic banking terms, practice simple math, and prepare to talk about why you want to work in banking.', 'Finance'),
('ICICI Bank', 'A leading private sector bank in India providing retail banking, corporate banking, and wealth management services nationwide.', ARRAY['Bank Associate','Customer Support Executive','Operations Executive','Financial Analyst','Sales & Marketing Executive'], ARRAY['Aptitude Test','Group Discussion','Personal Interview','HR Round'], 'Practice aptitude and read up on banking basics. Be confident in group discussions and speak clearly.', 'Finance'),
('Deloitte', 'A global professional services firm providing audit, tax, consulting, and financial advisory services to large companies.', ARRAY['Financial Analyst','Data Analyst','Operations Executive','HR Recruiter','Accountant'], ARRAY['Online Assessment','Group Discussion','Technical Interview','HR Round'], 'Read up on basic accounting and business terms, and practice speaking confidently in group discussions.', 'Finance'),
('EY (Ernst & Young)', 'One of the Big Four accounting firms, offering audit, tax, transaction advisory, and consulting services to businesses worldwide.', ARRAY['Financial Analyst','Accountant','Data Analyst','Operations Executive','HR Recruiter'], ARRAY['Online Assessment','Technical Interview','HR Round'], 'Brush up on accounting principles and be ready to discuss real-world business scenarios and their financial impact.', 'Finance'),
-- Healthcare & Pharma (4)
('Sun Pharma', 'India''s largest pharmaceutical company, manufacturing and selling medicines across therapy areas in India and globally.', ARRAY['Pharmacist','Sales & Marketing Executive','Operations Executive','Data Analyst','Customer Support Executive'], ARRAY['Aptitude Test','Technical Interview','HR Round'], 'Revise pharmacy basics, learn about Sun Pharma''s product lines, and be ready to discuss drug safety and regulations.', 'Healthcare'),
('Apollo Hospitals', 'India''s largest private healthcare network, operating hospitals, pharmacies, clinics, and diagnostic centers across the country.', ARRAY['Staff Nurse','Pharmacist','Customer Support Executive','Operations Executive','HR Recruiter'], ARRAY['Written Test / Skill Assessment','Personal Interview','HR Round'], 'For clinical roles, revise your core medical/nursing knowledge. For non-clinical roles, prepare examples of handling patient queries.', 'Healthcare'),
('Cipla', 'A leading global pharmaceutical company that develops and manufactures medicines for respiratory, HIV, and cancer treatment worldwide.', ARRAY['Pharmacist','Sales & Marketing Executive','Operations Executive','Data Analyst'], ARRAY['Aptitude Test','Technical Interview','HR Round'], 'Learn about Cipla''s therapy areas and be ready to discuss how your pharmacy knowledge applies to real patients.', 'Healthcare'),
('Fortis Healthcare', 'A major private hospital chain in India providing multi-specialty healthcare, diagnostics, and day-care services across cities.', ARRAY['Staff Nurse','Pharmacist','Customer Support Executive','Operations Executive','Front Office Executive'], ARRAY['Skill Assessment','Personal Interview','HR Round'], 'Revise your clinical or customer-service skills and be ready to show empathy and professionalism in patient-care scenarios.', 'Healthcare'),
-- Retail & FMCG (4)
('Reliance', 'India''s largest conglomerate, operating in telecom, retail, energy, and digital services serving millions of customers.', ARRAY['Sales & Marketing Executive','Customer Support Executive','Operations Executive','Data Analyst','Data Entry Operator'], ARRAY['Aptitude Test','Group Discussion','Personal Interview','HR Round'], 'Learn about Reliance''s businesses (Jio, Retail, Energy), practice group discussion skills, and be confident and clear.', 'Retail'),
('ITC', 'A major Indian conglomerate in FMCG, hotels, packaging, and agri-business, known for brands like Aashirvaad, Sunfeast, and Gold Flake.', ARRAY['Sales & Marketing Executive','Operations Executive','Customer Support Executive','Data Analyst','Content Writer'], ARRAY['Aptitude Test','Group Discussion','Technical Interview','HR Round'], 'Learn about ITC''s product brands and be ready to discuss how you would market or sell FMCG products in your area.', 'Retail'),
('Big Bazaar / Future Retail', 'One of India''s largest retail store chains, selling groceries, clothing, electronics, and household goods to millions of shoppers.', ARRAY['Sales & Marketing Executive','Customer Support Executive','Operations Executive','Data Entry Operator','Cashier'], ARRAY['Aptitude Test','Personal Interview','HR Round'], 'Show enthusiasm for retail work, be ready to discuss handling customers, and demonstrate basic math and computer skills.', 'Retail'),
('Tata Consumer Products', 'A Tata Group company selling tea, coffee, water, and food products under brands like Tata Tea, Tetley, and Tata Salt across India.', ARRAY['Sales & Marketing Executive','Operations Executive','Data Analyst','Content Writer','Customer Support Executive'], ARRAY['Aptitude Test','Group Discussion','Personal Interview','HR Round'], 'Learn about Tata''s consumer brands, understand basic sales and distribution, and be ready to discuss marketing ideas.', 'Retail'),
-- Government / PSU (4)
('ONGC', 'India''s largest government oil and gas company, exploring and producing crude oil and natural gas across the country.', ARRAY['Mechanical Engineer','Civil Site Engineer','Operations Executive','Data Analyst','IT Support Technician'], ARRAY['Written Test / GATE','Technical Interview','Medical Examination','HR Round'], 'Prepare for GATE-based or ONGC-specific written exam, revise core engineering subjects, and stay updated on energy sector news.', 'Government'),
('ISRO', 'India''s national space agency, designing and launching satellites, space missions, and conducting space research for the nation.', ARRAY['Software Engineer','Mechanical Engineer','Civil Site Engineer','Data Analyst','IT Support Technician'], ARRAY['Written Test','Technical Interview','Interview Panel','HR Round'], 'Prepare thoroughly for the technical written exam, revise core subjects deeply, and be ready for a detailed interview panel.', 'Government'),
('SBI (State Bank of India)', 'India''s largest public sector bank, serving millions of customers with banking, loans, and financial services nationwide.', ARRAY['Bank Associate','Customer Support Executive','Operations Executive','Accountant','Data Entry Operator'], ARRAY['Preliminary Exam','Mains Exam','Interview'], 'Study for SBI''s competitive exam (reasoning, English, aptitude), and practice interview questions about banking awareness.', 'Government'),
('Indian Army', 'India''s land-based military force, offering career opportunities in technical, non-technical, and combat roles across the country.', ARRAY['Operations Executive','Mechanical Engineer','Civil Site Engineer','IT Support Technician','Logistics Officer'], ARRAY['Written Exam / NDA / CDS','Physical Fitness Test','SSB Interview','Medical Examination'], 'Prepare for the relevant entrance exam (NDA, CDA, or technical entry), maintain physical fitness, and practice for SSB interview rounds.', 'Government');

-- ============================================================
-- SEED: COURSES (20 courses)
-- ============================================================
INSERT INTO courses (title, platform, skill, difficulty, estimated_time, reason, is_free) VALUES
('Python for Everybody', 'Coursera', 'Python', 'Beginner', '2 months', 'Starts from zero and walks you through Python with simple everyday examples anyone can follow.', false),
('Learn Python Full Course', 'freeCodeCamp', 'Python', 'Beginner', '4 hours', 'One free video that covers all Python basics with hands-on coding examples in a single sitting.', true),
('Programming in Python', 'NPTEL', 'Python', 'Beginner', '4 weeks', 'A college-level course taught step by step with weekly assignments that build your confidence gradually.', true),
('SQL for Data Science', 'Coursera', 'SQL', 'Beginner', '1 month', 'Teaches SQL through simple data tasks so you learn by writing real queries from day one.', false),
('Excel Skills for Business', 'Coursera', 'MS Excel', 'Beginner', '1 month', 'Builds spreadsheet skills step by step with practical business tasks and easy-to-follow exercises.', false),
('Tally ERP 9 Basics', 'Skill India Digital', 'Tally & Accounting', 'Beginner', '3 weeks', 'A government-backed course that teaches accounting software in simple Hindi and English.', true),
('Fundamentals of Digital Marketing', 'Google Digital Garage', 'Digital Marketing', 'Beginner', '2 weeks', 'A free Google course with short video lessons covering social media, SEO, and online ads in plain language.', true),
('Inbound Marketing Certification', 'HubSpot Academy', 'Digital Marketing', 'Beginner', '1 week', 'Free industry-recognized course that teaches how to attract customers online with practical examples.', true),
('Content Writing Mastery', 'HubSpot Academy', 'Content Writing', 'Beginner', '1 week', 'Short free lessons that teach you how to write clear engaging content for blogs and social media.', true),
('Effective Communication Skills', 'SWAYAM', 'Communication', 'Beginner', '4 weeks', 'A government free course that covers speaking, listening, and workplace communication in simple language.', true),
('Communication Skills Course', 'NPTEL', 'Communication', 'Beginner', '4 weeks', 'College-level course with practical exercises to help you speak and present confidently.', true),
('AutoCAD for Beginners', 'Skill India Digital', 'AutoCAD', 'Beginner', '3 weeks', 'Government-backed course that teaches 2D and 3D design step by step with real engineering drawings.', true),
('Engineering Drawing with AutoCAD', 'NPTEL', 'AutoCAD', 'Beginner', '4 weeks', 'Learn technical drawing and CAD fundamentals with guided assignments perfect for first-time users.', true),
('Customer Support Essentials', 'HubSpot Academy', 'Customer Support', 'Beginner', '1 week', 'Free short course on how to help customers effectively with real-world scenarios and tips.', true),
('Sales and Marketing Basics', 'HubSpot Academy', 'Sales & Marketing', 'Beginner', '1 week', 'Free practical course covering the basics of selling and marketing with easy-to-understand examples.', true),
('Problem Solving Through Programming', 'NPTEL', 'Problem Solving', 'Beginner', '4 weeks', 'Connects problem-solving thinking with basic programming in a way anyone can understand.', true),
('Data Entry and Computer Basics', 'Skill India Digital', 'Data Entry', 'Beginner', '2 weeks', 'Government course that teaches typing, spreadsheets, and data organization from the very beginning.', true),
('Leadership and Team Management', 'Coursera', 'Leadership', 'Beginner', '1 month', 'Simple lessons on how to lead a team, communicate well, and manage tasks at work.', false),
('JavaScript Basics', 'freeCodeCamp', 'JavaScript', 'Beginner', '3 months', 'Learn JavaScript fundamentals while building small projects that give you real coding confidence.', true),
('Pharmacy Management Course', 'SWAYAM', 'Pharmacy Knowledge', 'Beginner', '4 weeks', 'Covers pharmacy operations, drug safety, and patient communication in a beginner-friendly format.', true);

-- ============================================================
-- SEED: INTERVIEW QUESTIONS
-- (10 Q&A for top roles + 10 Q&A for top companies)
-- ============================================================

-- Software Engineer
INSERT INTO interview_questions (target_type, target_name, question, sample_answer, sort_order) VALUES
('role','Software Engineer','Tell me about yourself.','I am a recent computer science graduate with a strong foundation in Python and Java. During my studies, I built two projects — a student management system and a weather app — which helped me practice coding, debugging, and working with databases. I am eager to start my career as a software engineer and contribute to real-world projects.',1),
('role','Software Engineer','What programming languages are you comfortable with?','I am most comfortable with Python and Java. I have used Python for data tasks and small scripts, and Java for building object-oriented applications. I also know basic SQL for database queries and HTML/CSS for web pages.',2),
('role','Software Engineer','What is the difference between an array and a linked list?','An array stores elements in continuous memory locations, so accessing any element is fast. A linked list stores elements in separate nodes connected by pointers, so inserting or deleting in the middle is faster but accessing a specific element takes longer.',3),
('role','Software Engineer','Explain what object-oriented programming (OOP) means in simple terms.','OOP is a way of writing code where we organize everything as objects — like real-world things. For example, a Car object has properties like color and speed, and actions like start and stop. The four main ideas are encapsulation, inheritance, polymorphism, and abstraction.',4),
('role','Software Engineer','What is a bug and how do you fix one?','A bug is an error in code that makes the program behave wrongly or crash. I fix bugs by first reproducing the error, then reading the error message, checking the relevant code line by line, and testing small changes until the issue is resolved.',5),
('role','Software Engineer','What is a database and why do we use it?','A database is an organized collection of data stored in a computer. We use it to store, search, update, and manage large amounts of information quickly and safely. SQL is the language we use to talk to databases.',6),
('role','Software Engineer','Why do you want to join our company?','I want to join your company because it works on exciting technology projects and has a great learning culture. As a fresher, I want a place where I can grow my skills, work with experienced engineers, and contribute to meaningful software.',7),
('role','Software Engineer','What project are you most proud of and why?','I am most proud of my student management system project. I built it using Python and SQL, and it let teachers add, search, and update student records. It taught me how to connect a database to a program and handle user inputs correctly.',8),
('role','Software Engineer','How do you handle pressure or tight deadlines?','I handle pressure by breaking the work into smaller tasks, prioritizing the most important ones, and focusing on one thing at a time. I also communicate with my team early if I need help, instead of waiting until the last minute.',9),
('role','Software Engineer','Do you have any questions for us?','Yes, I would like to know what a typical day looks like for a fresher joining your team, and what technologies I should learn before joining to be better prepared.',10),

-- Data Analyst
('role','Data Analyst','Tell me about yourself.','I am a graduate with a strong interest in data and numbers. I have learned Python, SQL, and Excel through my studies and online courses. I enjoy finding patterns in data and presenting them in a way that helps people make decisions.',1),
('role','Data Analyst','What is the difference between SQL and Excel for data analysis?','Excel is great for small datasets and quick calculations with formulas and charts. SQL is used for larger datasets stored in databases — it lets you query, filter, and join thousands of rows efficiently. I use both depending on the task size.',2),
('role','Data Analyst','What steps do you follow to analyze a dataset?','First, I understand what question we are trying to answer. Then I clean the data by removing duplicates and fixing missing values. Next, I explore the data using summaries and charts. Finally, I present my findings in a clear report or dashboard.',3),
('role','Data Analyst','What is data cleaning and why is it important?','Data cleaning means fixing or removing incorrect, duplicate, or missing data from a dataset. It is important because dirty data leads to wrong conclusions. Clean data ensures our analysis and reports are accurate and trustworthy.',4),
('role','Data Analyst','Explain a SQL JOIN in simple terms.','A SQL JOIN combines data from two different tables based on a common column between them. For example, if one table has customer names and another has their orders, a JOIN connects them so you can see which customer placed which order.',5),
('role','Data Analyst','What tools have you used for data analysis?','I have used Excel for spreadsheets and pivot tables, SQL for querying databases, and Python with pandas for larger data tasks. I have also created basic charts and dashboards to present my findings visually.',6),
('role','Data Analyst','How would you explain a complex data finding to a non-technical person?','I would avoid technical terms and use simple analogies. I would focus on what the finding means for their work and use a clear chart or visual to support it. For example, instead of saying the correlation is 0.85, I would say these two things strongly move together.',7),
('role','Data Analyst','What is a pivot table?','A pivot table is a tool in Excel that lets you summarize large amounts of data quickly. You can group, count, sum, or average data by different categories without writing formulas. It helps you see patterns at a glance.',8),
('role','Data Analyst','Why do you want to be a data analyst?','I enjoy working with numbers and finding stories hidden inside data. I like the feeling of turning raw data into insights that help a business make better decisions. It is a role where learning never stops, which excites me.',9),
('role','Data Analyst','Do you have any questions for us?','Yes, I would like to know what tools your team uses most often and what kind of data projects a fresher typically works on here.',10),

-- Financial Analyst
('role','Financial Analyst','Tell me about yourself.','I am a commerce graduate with a strong understanding of accounting, Excel, and financial statements. I enjoy working with numbers and helping businesses understand their financial position. I have completed projects on budgeting and financial reporting during my studies.',1),
('role','Financial Analyst','What are the three main financial statements?','The three main financial statements are the income statement (shows profit or loss), the balance sheet (shows what the company owns and owes), and the cash flow statement (shows how cash moves in and out of the business).',2),
('role','Financial Analyst','How do you analyze a company''s financial health?','I start by reviewing the income statement for profitability, the balance sheet for stability, and the cash flow statement for liquidity. Then I calculate key ratios like profit margin, debt-to-equity, and current ratio to understand if the company is healthy.',3),
('role','Financial Analyst','What is working capital and why does it matter?','Working capital is the money a company has for day-to-day operations, calculated as current assets minus current liabilities. It matters because if working capital is too low, the company may struggle to pay its short-term bills and suppliers.',4),
('role','Financial Analyst','How proficient are you in Excel?','I am very comfortable with Excel. I can use VLOOKUP, pivot tables, conditional formatting, and basic formulas like SUMIF and COUNTIF. I have built financial models and budget trackers in Excel during my studies.',5),
('role','Financial Analyst','What is the difference between profit and cash flow?','Profit is the money left after subtracting all expenses from revenue on paper. Cash flow is the actual money moving in and out of the business. A company can be profitable but still run out of cash if customers pay late.',6),
('role','Financial Analyst','Why do you want to work in finance?','I have always been interested in how businesses manage money and make investment decisions. Finance lets me use my analytical skills to help companies plan better and grow. I find it rewarding to turn numbers into useful business advice.',7),
('role','Financial Analyst','How do you ensure accuracy in your financial reports?','I double-check all my formulas, cross-reference totals with source data, and review my work line by line before finalizing. I also keep clear notes on assumptions I made so others can verify my calculations.',8),
('role','Financial Analyst','What financial ratios do you find most useful?','I find the current ratio useful for checking short-term health, the debt-to-equity ratio for understanding risk, and the net profit margin for measuring profitability. Together they give a quick picture of how well a company is managed.',9),
('role','Financial Analyst','Do you have any questions for us?','Yes, I would like to know what financial tools your team uses daily and what types of reports a fresher is expected to prepare in the first few months.',10),

-- HR Recruiter
('role','HR Recruiter','Tell me about yourself.','I am a management graduate who enjoys working with people. I have good communication skills and have helped organize campus placement events during my studies. I am interested in HR because I like matching the right people to the right jobs.',1),
('role','HR Recruiter','What does a recruiter do day to day?','A recruiter starts by understanding what roles need to be filled, then sources candidates through job portals, LinkedIn, and referrals. They screen resumes, conduct initial phone interviews, schedule technical rounds, and coordinate with hiring managers until the right candidate is selected.',2),
('role','HR Recruiter','How do you source candidates?','I use job portals like Naukri and LinkedIn to search for candidates with the right skills. I also ask for referrals from current employees and attend college placement drives. For senior roles, I use targeted searches and direct outreach messages.',3),
('role','HR Recruiter','What do you look for in a resume?','I look for relevant skills, experience, and education that match the job description. I also check for stability in previous jobs, clear career progression, and any achievements that show the candidate stands out. Formatting and clarity also matter.',4),
('role','HR Recruiter','How do you handle a candidate who rejects the offer?','I first try to understand their reason politely — it could be salary, location, or a competing offer. I share their feedback with the hiring team to see if we can adjust. If not, I keep the relationship positive and move to the next best candidate quickly.',5),
('role','HR Recruiter','What is the importance of onboarding?','Onboarding helps a new employee settle into the company smoothly. It covers orientation, paperwork, team introductions, and training. Good onboarding makes new hires feel welcome and productive faster, which improves retention.',6),
('role','HR Recruiter','How do you handle pressure during bulk hiring?','I stay organized by using a tracking spreadsheet for all candidates, setting daily targets for screening, and prioritizing the most urgent roles first. I also communicate clearly with managers so everyone knows the progress and expectations.',7),
('role','HR Recruiter','Why do you want to work in HR?','I enjoy interacting with people and helping them find opportunities that match their strengths. HR is a field where you directly impact someone''s career and a company''s growth. I find that very meaningful and rewarding.',8),
('role','HR Recruiter','How do you conduct a phone screening?','I start by briefly introducing the company and role. Then I ask about their current status, relevant experience, salary expectations, and availability. I keep it friendly and short, about 10-15 minutes, and note down key points for the hiring manager.',9),
('role','HR Recruiter','Do you have any questions for us?','Yes, I would like to know what roles I would be hiring for initially and what tools or portals the team uses for sourcing candidates.',10),

-- Customer Support Executive
('role','Customer Support Executive','Tell me about yourself.','I am a friendly and patient person who enjoys helping others. I have good communication skills in English and my regional language. During my studies, I volunteered at a help desk, which taught me how to handle queries calmly and professionally.',1),
('role','Customer Support Executive','How would you handle an angry customer?','I would listen to them without interrupting, let them finish their complaint, and then apologize for their experience. I would stay calm, show empathy, and focus on finding a solution. If I cannot solve it immediately, I would assure them I will follow up and keep my promise.',2),
('role','Customer Support Executive','What does good customer service mean to you?','Good customer service means listening to the customer, understanding their problem quickly, and providing a correct and friendly solution. It also means treating every customer with respect, even if they are upset, and making sure they feel heard and valued.',3),
('role','Customer Support Executive','How do you handle a question you do not know the answer to?','I would be honest and tell the customer that I want to give them the right answer, so I will check and get back to them quickly. I would then consult my team or knowledge base, find the correct answer, and follow up with the customer as promised.',4),
('role','Customer Support Executive','Are you comfortable working in shifts?','Yes, I am comfortable working in shifts. I understand that customer support often requires early morning, evening, or night shifts to serve customers across different times. I am flexible and willing to adjust my schedule as needed.',5),
('role','Customer Support Executive','How do you manage multiple customer chats at the same time?','I prioritize by urgency — customers with urgent issues get attention first. I use templates for common questions to respond faster, and I keep each chat organized by taking quick notes. I make sure no customer is left waiting too long.',6),
('role','Customer Support Executive','Why do you want to work in customer support?','I enjoy helping people solve problems, and I am a good listener. Customer support lets me use my communication skills to make someone''s day better. I also like that every day brings different questions, so the work stays interesting.',7),
('role','Customer Support Executive','How do you stay motivated during repetitive work?','I stay motivated by reminding myself that each customer deserves a helpful and friendly response, even if the question is similar. I also set small personal goals, like improving my response time or getting positive feedback, to keep things engaging.',8),
('role','Customer Support Executive','What would you do if a customer asked for a refund you cannot approve?','I would listen to their reason, check the company''s refund policy, and explain it clearly and politely. If I cannot approve it, I would tell them why honestly and offer any alternative solution available. If needed, I would escalate to a supervisor.',9),
('role','Customer Support Executive','Do you have any questions for us?','Yes, I would like to know what type of support this role involves — phone, chat, or email — and what training is provided for new joiners.',10),

-- TCS (company)
('company','TCS','Why do you want to join TCS?','TCS is one of India''s largest and most respected IT companies. It offers great learning opportunities for freshers, works on global projects, and has a strong work culture. I want to start my career where I can learn, grow, and build a long-term future.',1),
('company','TCS','Tell me about yourself.','I am a recent graduate with a foundation in programming and problem-solving. I have built small projects during my studies and enjoy learning new technologies. I am hardworking, a quick learner, and excited to begin my professional journey at a company like TCS.',2),
('company','TCS','What do you know about TCS?','TCS stands for Tata Consultancy Services. It is part of the Tata Group and is one of the largest IT services companies in the world. It provides software development, consulting, and digital solutions to clients across many industries in over 40 countries.',3),
('company','TCS','Are you willing to relocate?','Yes, I am willing to relocate. I understand that TCS has offices across India and projects may require working from different locations. I am flexible and see it as an opportunity to experience new places and work with different teams.',4),
('company','TCS','What are your strengths and weaknesses?','My strength is that I am a quick learner who adapts easily to new tools and situations. My weakness is that I sometimes spend too much time perfecting small details, but I have learned to set time limits and prioritize completing tasks first.',5),
('company','TCS','Why should we hire you?','You should hire me because I am eager to learn, committed to doing quality work, and ready to contribute to the team from day one. My academic background and project experience have prepared me to take on real responsibilities and grow with TCS.',6),
('company','TCS','Where do you see yourself in five years?','In five years, I see myself as a skilled professional who has grown from a fresher into someone who handles bigger responsibilities and mentors new team members. I want to build deep expertise in my area and contribute to important company projects.',7),
('company','TCS','What is your favorite subject and why?','My favorite subject is programming because I enjoy the logical thinking it requires. I like the satisfaction of solving a problem with code and seeing my program work. It feels like solving a puzzle, which keeps me motivated to learn more.',8),
('company','TCS','How do you handle working under pressure?','I handle pressure by staying organized and calm. I break tasks into smaller steps, focus on one at a time, and ask for help when needed. I remind myself that pressure is a normal part of work and that careful planning reduces stress.',9),
('company','TCS','Do you have any questions for us?','Yes, I would like to know what training is provided to freshers during the initial months and what technologies I might be working on after training.',10),

-- HDFC Bank (company)
('company','HDFC Bank','Why do you want to join HDFC Bank?','HDFC Bank is one of India''s most trusted and fastest-growing private banks. It is known for its customer-first approach and strong work culture. I want to build my career in banking and HDFC gives me the best platform to learn, grow, and serve customers well.',1),
('company','HDFC Bank','What do you know about HDFC Bank?','HDFC Bank is one of India''s largest private sector banks. It offers savings accounts, loans, credit cards, and investment services to millions of customers. It is known for its technology-driven services and wide network of branches across India.',2),
('company','HDFC Bank','Tell me about yourself.','I am a commerce graduate with a good understanding of banking basics, Excel, and accounting. I enjoy interacting with people and have strong communication skills. I am looking for a role where I can use my knowledge to help customers and grow within the banking sector.',3),
('company','HDFC Bank','What are the main products of a bank?','A bank offers savings and current accounts for depositing money, loans for personal, home, and business needs, credit cards, fixed deposits, and investment products like mutual funds and insurance. These products help customers save, borrow, and grow their money.',4),
('company','HDFC Bank','How would you handle a difficult customer at the bank?','I would listen patiently to their concern, apologize if they had a bad experience, and try to understand the issue fully. Then I would explain the solution clearly or find the right person to help. I would stay calm and professional throughout.',5),
('company','HDFC Bank','What is a KYC and why is it important?','KYC stands for Know Your Customer. It is the process of verifying a customer''s identity using documents like Aadhaar, PAN, and address proof before opening an account. It is important to prevent fraud, money laundering, and ensure safe banking.',6),
('company','HDFC Bank','Are you comfortable with sales targets?','Yes, I am comfortable with sales targets. I understand that banking roles often involve meeting goals for accounts, loans, or credit cards. I am a motivated person who enjoys challenges, and I will work sincerely to achieve my targets while keeping customers happy.',7),
('company','HDFC Bank','Why banking as a career?','Banking is a stable and growing sector that offers many career paths. It lets me use my commerce knowledge, interact with different people every day, and learn about finance practically. It also offers good growth opportunities for hardworking candidates.',8),
('company','HDFC Bank','How do you handle confidential information?','I take confidentiality very seriously. I would never share customer or bank information with unauthorized people. I would follow all bank security procedures, lock my computer when away, and report any suspicious activity to my supervisor immediately.',9),
('company','HDFC Bank','Do you have any questions for us?','Yes, I would like to know what the first few months of training look like for a new joiner and what growth opportunities HDFC Bank offers over time.',10),

-- Infosys (company)
('company','Infosys','Why do you want to join Infosys?','Infosys is a globally respected IT company known for its strong training programs and excellent work culture. It gives freshers a great foundation through its world-class training campus. I want to start my career where learning is valued and growth opportunities are clear.',1),
('company','Infosys','What do you know about Infosys?','Infosys is a global IT consulting and services company headquartered in Bangalore. It helps businesses with digital transformation, software development, and cloud services. It is known for its famous Mysore training campus and strong emphasis on learning.',2),
('company','Infosys','Tell me about yourself.','I am a graduate with a passion for technology and problem-solving. I have learned programming through my studies and built small projects. I am a quick learner who adapts well to new environments and I am excited to begin my IT career at Infosys.',3),
('company','Infosys','What is the difference between C and Java?','C is a procedural programming language that focuses on functions and steps. Java is an object-oriented language where we organize code around objects and classes. Java also has features like automatic memory management and runs on any platform, making it more versatile.',4),
('company','Infosys','Are you willing to work in night shifts?','Yes, I am willing to work in night shifts. I understand that IT projects often serve clients in different time zones, which may require night or rotational shifts. I am flexible and ready to adjust my schedule as the project needs.',5),
('company','Infosys','What is your greatest achievement?','My greatest achievement was completing my final year project successfully. I built a small web application from scratch, which required learning new tools on my own. It gave me confidence that I can learn independently and deliver results when I commit to something.',6),
('company','Infosys','How do you keep yourself updated with technology?','I follow technology blogs, watch free YouTube tutorials, and take online courses on platforms like freeCodeCamp and NPTEL. I also practice coding regularly. I believe staying curious and learning continuously is important in the IT field.',7),
('company','Infosys','What would you do if you disagree with a team member?','I would first listen to their perspective calmly and try to understand their reasoning. Then I would share my view respectfully with reasons. If we still disagree, I would suggest talking to our team lead and go with whatever is best for the project.',8),
('company','Infosys','Why should Infosys hire you?','Infosys should hire me because I am a dedicated learner with a strong foundation in programming and a positive attitude. I am ready to go through the rigorous training, work hard, and contribute to the team. I want to build a long-term career here.',9),
('company','Infosys','Do you have any questions for us?','Yes, I would like to know what happens during the training period at the Mysore campus and how project allocation works after training.',10);
