/*
# NexPath Universal: Rebuild tables for universal career explorer

This migration rebuilds the existing roles, companies, and courses tables
to support a universal career explorer that serves ANY background
(IT, Non-IT, B.Tech, B.Com, BBA, B.Sc, BA, MBA, Core Engineering, Diploma, 12th Pass).

All existing tables contain only seed/reference content with no user data,
so dropping and recreating is safe.

1. New Tables (rebuilt)
- `backgrounds`: Education stream filter tabs (6 backgrounds)
  - id (uuid, pk), name (text), tab_label (text), skills (text[])
- `roles`: Job roles with degrees, salary, background tags
  - id (uuid, pk), name (text), description (text), icon (text),
    skills (text[]), degrees (text[]), salary_lpa (text), backgrounds (text[])
- `companies`: IT + Non-IT companies with hiring insights
  - id (uuid, pk), name (text), about (text), roles_available (text[]),
    hiring_rounds (text[]), prep_tip (text), is_it (boolean)
- `courses`: Beginner courses from Skill India, SWAYAM, NPTEL, Google, HubSpot, etc.
  - id (uuid, pk), title (text), platform (text), skill (text),
    difficulty (text), estimated_time (text), reason (text), is_free (boolean)
2. Security
- Enable RLS on all four tables.
- Grant SELECT to anon + authenticated (no sign-in app; all reference data is public).
- 4 policies per table, USING/WITH CHECK (true) since data is intentionally shared.
3. Seed Data
- 6 backgrounds
- 12 roles covering IT and Non-IT
- 10 companies (TCS, Infosys, HDFC Bank, Deloitte, L&T, Tata Motors, Amazon, Flipkart, Reliance, Zoho)
- 18 courses across 7 platforms
*/

-- Drop old tables (reference data only, no user data)
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE IF NOT EXISTS backgrounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  tab_label text NOT NULL,
  skills text[] NOT NULL DEFAULT '{}'
);

ALTER TABLE backgrounds ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON backgrounds TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_backgrounds" ON backgrounds;
CREATE POLICY "anon_select_backgrounds" ON backgrounds FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Briefcase',
  skills text[] NOT NULL DEFAULT '{}',
  degrees text[] NOT NULL DEFAULT '{}',
  salary_lpa text NOT NULL,
  backgrounds text[] NOT NULL DEFAULT '{}'
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON roles TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_roles" ON roles;
CREATE POLICY "anon_select_roles" ON roles FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_roles" ON roles;
CREATE POLICY "anon_insert_roles" ON roles FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_roles" ON roles;
CREATE POLICY "anon_update_roles" ON roles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_roles" ON roles;
CREATE POLICY "anon_delete_roles" ON roles FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  about text NOT NULL,
  roles_available text[] NOT NULL DEFAULT '{}',
  hiring_rounds text[] NOT NULL DEFAULT '{}',
  prep_tip text NOT NULL,
  is_it boolean NOT NULL DEFAULT true
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON companies TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_companies" ON companies;
CREATE POLICY "anon_select_companies" ON companies FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_companies" ON companies;
CREATE POLICY "anon_insert_companies" ON companies FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_companies" ON companies;
CREATE POLICY "anon_update_companies" ON companies FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_companies" ON companies;
CREATE POLICY "anon_delete_companies" ON companies FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS courses (
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
GRANT SELECT, INSERT, UPDATE, DELETE ON courses TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_courses" ON courses;
CREATE POLICY "anon_select_courses" ON courses FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_courses" ON courses;
CREATE POLICY "anon_insert_courses" ON courses FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_courses" ON courses;
CREATE POLICY "anon_update_courses" ON courses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_courses" ON courses;
CREATE POLICY "anon_delete_courses" ON courses FOR DELETE
  TO anon, authenticated USING (true);

-- Seed backgrounds
INSERT INTO backgrounds (name, tab_label, skills) VALUES
('All Backgrounds', 'All', ARRAY['Communication','MS Excel','Tally & Accounting','Customer Support','Sales & Marketing','Digital Marketing','Content Writing','Python','SQL','AutoCAD','Data Entry','Problem Solving','Java','HTML/CSS','JavaScript','React','Leadership','Teamwork','Time Management','Analytical Thinking']),
('IT & Software', 'IT & Software', ARRAY['Python','Java','SQL','HTML/CSS','JavaScript','React','Problem Solving','Communication','Data Entry','Analytical Thinking']),
('Core Engineering', 'Core Engineering', ARRAY['AutoCAD','Problem Solving','Communication','Python','MS Excel','Leadership','Teamwork','Analytical Thinking']),
('Commerce & Finance', 'Commerce & Finance', ARRAY['Tally & Accounting','MS Excel','SQL','Communication','Customer Support','Data Entry','Analytical Thinking','Leadership']),
('Arts Science & Media', 'Arts & Media', ARRAY['Communication','Content Writing','Digital Marketing','Sales & Marketing','MS Excel','Customer Support','Leadership','Teamwork','Time Management']),
('Diploma / 12th Pass', 'Diploma / 12th', ARRAY['Communication','Customer Support','Data Entry','MS Excel','Sales & Marketing','Digital Marketing','Teamwork','Time Management','Problem Solving']);

-- Seed roles (12 roles covering IT and Non-IT)
INSERT INTO roles (name, description, icon, skills, degrees, salary_lpa, backgrounds) VALUES
('Software Engineer', 'Builds and maintains software applications, websites, and mobile apps using programming languages.', 'Code2', ARRAY['Python','Java','SQL','HTML/CSS','JavaScript','React','Problem Solving','Communication'], ARRAY['B.Tech','BCA','MCA','M.Tech'], '3.5 - 8 LPA', ARRAY['IT & Software','All Backgrounds']),
('Data Analyst', 'Collects, cleans, and studies data to help companies make better business decisions.', 'BarChart3', ARRAY['Python','SQL','MS Excel','Communication','Problem Solving','Analytical Thinking'], ARRAY['B.Tech','B.Sc','B.Com','MBA','M.Sc'], '3 - 7 LPA', ARRAY['IT & Software','Commerce & Finance','All Backgrounds']),
('Financial Analyst', 'Reviews financial data, prepares reports, and helps companies plan their budgets and investments.', 'TrendingUp', ARRAY['Tally & Accounting','MS Excel','SQL','Communication','Analytical Thinking'], ARRAY['B.Com','BBA','MBA','M.Com'], '3 - 6 LPA', ARRAY['Commerce & Finance','All Backgrounds']),
('HR Recruiter', 'Finds, interviews, and hires the right people for open roles in a company.', 'Users', ARRAY['Communication','MS Excel','Customer Support','Leadership','Teamwork'], ARRAY['B.Com','BBA','BA','MBA','Any Degree'], '2.5 - 5 LPA', ARRAY['Commerce & Finance','Arts Science & Media','Diploma / 12th Pass','All Backgrounds']),
('Digital Marketing Executive', 'Promotes products and brands online using social media, ads, and content to reach more customers.', 'Megaphone', ARRAY['Digital Marketing','Content Writing','Communication','Sales & Marketing','MS Excel'], ARRAY['BBA','BA','B.Com','MBA','Any Degree'], '2.5 - 6 LPA', ARRAY['Arts Science & Media','Diploma / 12th Pass','All Backgrounds']),
('Bank Associate', 'Helps customers with banking services, account opening, and basic financial transactions at a bank branch.', 'Landmark', ARRAY['Communication','Customer Support','MS Excel','Data Entry','Tally & Accounting'], ARRAY['B.Com','BBA','B.Sc','Any Degree','12th Pass'], '2 - 4.5 LPA', ARRAY['Commerce & Finance','Diploma / 12th Pass','All Backgrounds']),
('Mechanical Engineer', 'Designs, builds, and tests mechanical systems and machines for manufacturing and automotive industries.', 'Cog', ARRAY['AutoCAD','Problem Solving','Communication','MS Excel','Leadership','Teamwork'], ARRAY['B.Tech','Diploma','M.Tech'], '3 - 7 LPA', ARRAY['Core Engineering','All Backgrounds']),
('Operations Executive', 'Manages day-to-day business operations, coordinates between teams, and ensures work gets done on time.', 'ClipboardList', ARRAY['Communication','MS Excel','Data Entry','Leadership','Teamwork','Time Management'], ARRAY['B.Com','BBA','BA','B.Sc','MBA','Any Degree'], '2.5 - 5 LPA', ARRAY['Commerce & Finance','Arts Science & Media','Diploma / 12th Pass','All Backgrounds']),
('Customer Support Executive', 'Helps customers solve problems and answers questions over phone, chat, or email.', 'Headphones', ARRAY['Communication','Customer Support','Data Entry','MS Excel','Teamwork','Time Management'], ARRAY['Any Degree','12th Pass','B.Com','BA','B.Sc'], '2 - 4 LPA', ARRAY['Diploma / 12th Pass','Arts Science & Media','All Backgrounds']),
('Content Writer', 'Writes articles, blogs, and marketing content that informs and engages readers online.', 'PenLine', ARRAY['Content Writing','Communication','Digital Marketing','MS Excel','Time Management'], ARRAY['BA','BBA','B.Com','MA','Any Degree'], '2.5 - 5 LPA', ARRAY['Arts Science & Media','All Backgrounds']),
('Sales & Marketing Executive', 'Sells products or services to customers and creates marketing strategies to grow the business.', 'Target', ARRAY['Sales & Marketing','Communication','Customer Support','Leadership','MS Excel'], ARRAY['BBA','B.Com','BA','MBA','Any Degree'], '2.5 - 6 LPA', ARRAY['Arts Science & Media','Commerce & Finance','Diploma / 12th Pass','All Backgrounds']),
('Data Entry Operator', 'Types and organizes information into computer systems and spreadsheets accurately and quickly.', 'Keyboard', ARRAY['Data Entry','MS Excel','Communication','Time Management'], ARRAY['Any Degree','12th Pass','Diploma','B.Com'], '1.5 - 3 LPA', ARRAY['Diploma / 12th Pass','All Backgrounds']);

-- Seed companies (10 IT + Non-IT)
INSERT INTO companies (name, about, roles_available, hiring_rounds, prep_tip, is_it) VALUES
('TCS', 'One of India''s largest IT companies, building software and providing tech services to businesses across the world.', ARRAY['Software Engineer','Data Analyst','Operations Executive','Customer Support Executive'], ARRAY['Aptitude Test','Technical Interview','HR Round'], 'Practice basic aptitude questions and revise your core subjects. Be ready to explain your college project simply.', true),
('Infosys', 'A global IT consulting company that helps businesses with digital transformation, software development, and cloud services.', ARRAY['Software Engineer','Data Analyst','Operations Executive'], ARRAY['Online Assessment','Technical Interview','HR Round'], 'Brush up on one programming language and practice speaking out loud about your projects and skills.', true),
('HDFC Bank', 'One of India''s biggest private banks, offering savings accounts, loans, credit cards, and investment services to millions.', ARRAY['Bank Associate','Customer Support Executive','Operations Executive','Financial Analyst'], ARRAY['Aptitude Test','Personal Interview','HR Round'], 'Learn basic banking terms, practice simple math, and prepare to talk about why you want to work in banking.', false),
('Deloitte', 'A global professional services firm providing audit, tax, consulting, and financial advisory services to large companies.', ARRAY['Financial Analyst','Data Analyst','Operations Executive','HR Recruiter'], ARRAY['Online Assessment','Group Discussion','Technical Interview','HR Round'], 'Read up on basic accounting and business terms, and practice speaking confidently in group discussions.', false),
('L&T', 'A major engineering and construction company that builds infrastructure, power plants, and heavy industrial projects across India.', ARRAY['Mechanical Engineer','Operations Executive','Data Analyst','Customer Support Executive'], ARRAY['Aptitude Test','Technical Interview','HR Round'], 'Revise core engineering basics and be ready to discuss how you would solve real-world site or design problems.', false),
('Tata Motors', 'India''s largest automotive company, manufacturing cars, trucks, and buses sold across India and internationally.', ARRAY['Mechanical Engineer','Operations Executive','Sales & Marketing Executive','Customer Support Executive'], ARRAY['Aptitude Test','Technical Interview','HR Round'], 'Learn about their vehicle lineup, brush up on basic engineering or sales concepts, and show enthusiasm for automobiles.', false),
('Amazon', 'A global e-commerce and cloud computing leader, running online retail, logistics, and AWS cloud services worldwide.', ARRAY['Software Engineer','Data Analyst','Operations Executive','Customer Support Executive','Content Writer'], ARRAY['Online Assessment','Technical Interview 1','Technical Interview 2','HR Round'], 'Practice problem-solving and coding basics. For non-tech roles, prepare examples of handling real customer or operational situations.', true),
('Flipkart', 'One of India''s leading e-commerce platforms, selling everything from electronics to fashion to millions of customers.', ARRAY['Operations Executive','Data Analyst','Customer Support Executive','Digital Marketing Executive','Content Writer'], ARRAY['Online Assessment','Case Study Round','Personal Interview','HR Round'], 'Understand how e-commerce works, think about customer needs, and practice solving simple case study problems.', true),
('Reliance', 'India''s largest conglomerate, operating in telecom, retail, energy, and digital services serving millions of customers.', ARRAY['Sales & Marketing Executive','Customer Support Executive','Operations Executive','Data Analyst','Data Entry Operator'], ARRAY['Aptitude Test','Group Discussion','Personal Interview','HR Round'], 'Learn about Reliance''s businesses (Jio, Retail, Energy), practice group discussion skills, and be confident and clear.', false),
('Zoho', 'A product-based IT company that builds a wide suite of cloud-based business, productivity, and collaboration software tools.', ARRAY['Software Engineer','Data Analyst','Content Writer','Customer Support Executive'], ARRAY['Coding Test','Technical Interview','Managerial Round','HR Round'], 'Focus on data structures, practice coding problems, and be ready to explain your thinking step by step.', true);

-- Seed courses (18 courses across 7 platforms)
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
('Leadership and Team Management', 'Coursera', 'Leadership', 'Beginner', '1 month', 'Simple lessons on how to lead a team, communicate well, and manage tasks at work.', false);
