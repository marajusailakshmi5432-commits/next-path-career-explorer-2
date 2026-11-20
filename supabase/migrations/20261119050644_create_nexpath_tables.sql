/*
# NexPath: Create roles, companies, and courses tables

1. New Tables
- `roles`: Job roles with required skills and plain-English descriptions.
  - id (uuid, pk), name (text), description (text), icon (text), skills (text[])
- `companies`: Preset companies with hiring insights.
  - id (uuid, pk), name (text), what_they_do (text), hiring_rounds (text[]), key_skills (text[]), prep_tip (text)
- `courses`: Beginner-friendly courses mapped to skills.
  - id (uuid, pk), title (text), platform (text), skill (text), difficulty (text), estimated_time (text), reason (text)
2. Security
- Enable RLS on all three tables.
- Grant SELECT to anon + authenticated (no sign-in app; all reference data is public).
- 4 policies per table (select/insert/update/delete), all USING/WITH CHECK (true) since data is intentionally shared.
3. Seed Data
- 5 roles: Software Developer, Data Analyst, Business Analyst, QA Automation Engineer, UI/UX Designer
- 7 companies: TCS, Infosys, Wipro, Zoho, Accenture, Amazon, Google
- 12 courses covering Python, SQL, Data Analysis, HTML/CSS, JavaScript, React, Communication, Problem Solving, Java, Excel, Cloud Basics, C++
*/

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Briefcase',
  skills text[] NOT NULL DEFAULT '{}'
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
  what_they_do text NOT NULL,
  hiring_rounds text[] NOT NULL DEFAULT '{}',
  key_skills text[] NOT NULL DEFAULT '{}',
  prep_tip text NOT NULL
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
  reason text NOT NULL
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

-- Seed roles
INSERT INTO roles (name, description, icon, skills) VALUES
('Software Developer', 'Builds and maintains software applications that people use every day. Writes code, fixes bugs, and works with a team to ship features.', 'Code2', ARRAY['Python','Java','C++','HTML/CSS','JavaScript','React','Problem Solving','Cloud Basics']),
('Data Analyst', 'Turns raw data into insights by cleaning, analyzing, and visualizing it. Creates reports and dashboards to help teams make decisions.', 'BarChart3', ARRAY['Python','SQL','Excel','Data Analysis','Communication','Problem Solving']),
('Business Analyst', 'Bridges business goals and tech solutions by gathering requirements and documenting processes. Communicates with stakeholders to define what a project needs.', 'Briefcase', ARRAY['Excel','Communication','Problem Solving','Data Analysis','SQL']),
('QA Automation Engineer', 'Tests software to find bugs before users do by writing automated test scripts. Ensures new features work correctly and dont break existing ones.', 'ShieldCheck', ARRAY['Java','Python','JavaScript','Problem Solving','SQL','Communication']),
('UI/UX Designer', 'Designs how apps and websites look and feel so they are easy and enjoyable to use. Creates wireframes, prototypes, and user flows.', 'Palette', ARRAY['HTML/CSS','Communication','Problem Solving','JavaScript','React']);

-- Seed companies
INSERT INTO companies (name, what_they_do, hiring_rounds, key_skills, prep_tip) VALUES
('TCS', 'A global IT services giant that builds software, manages infrastructure, and provides consulting for businesses across industries worldwide.', ARRAY['Aptitude Test','Technical Interview','HR Round'], ARRAY['Java','SQL','Problem Solving','Communication','Python'], 'Practice aptitude questions on time, speed, and logical reasoning daily for two weeks before the test.'),
('Infosys', 'A major IT consulting and services company that helps enterprises with digital transformation, software development, and cloud adoption.', ARRAY['Online Assessment','Technical Interview','HR Round'], ARRAY['Java','Python','SQL','Problem Solving','Communication'], 'Brush up on core programming fundamentals and practice speaking your project answers out loud.'),
('Wipro', 'A global technology and business services company delivering IT solutions, cloud services, and engineering support to clients worldwide.', ARRAY['Aptitude Test','Technical Interview','HR Round'], ARRAY['Java','SQL','Python','Communication','Problem Solving'], 'Solve previous year aptitude papers and prepare two strong project explanations for the interview.'),
('Zoho', 'A product-based company that builds a suite of cloud-based business, productivity, and collaboration tools used by millions worldwide.', ARRAY['Coding Test','Technical Interview','Managerial Round','HR Round'], ARRAY['Java','C++','Python','JavaScript','Problem Solving','SQL'], 'Focus on data structures and algorithms — practice coding problems on arrays, strings, and linked lists.'),
('Accenture', 'A global professional services company offering strategy, consulting, digital, technology, and operations services to leading organizations.', ARRAY['Aptitude Test','Coding Round','Technical Interview','HR Round'], ARRAY['Python','Java','SQL','Communication','Problem Solving','Data Analysis'], 'Sharpen your coding basics in one language and rehearse common behavioral interview questions.'),
('Amazon', 'A global e-commerce and cloud computing leader that builds large-scale systems powering online retail, streaming, and AWS cloud services.', ARRAY['Online Assessment','Technical Interview 1','Technical Interview 2','Bar Raiser','HR Round'], ARRAY['Java','C++','Python','Data Structures','Problem Solving','Cloud Basics','SQL'], 'Practice medium and hard coding problems on trees, graphs, and dynamic programming for at least a month.'),
('Google', 'A global technology leader in search, cloud, and AI that builds products used by billions and hires for strong problem-solving and systems thinking.', ARRAY['Online Assessment','Phone Screen','Technical Interviews (4)','Behavioral Interview'], ARRAY['C++','Java','Python','Data Structures','Algorithms','Problem Solving','Cloud Basics'], 'Master data structures and algorithms deeply and practice explaining your thought process out loud while coding.');

-- Seed courses
INSERT INTO courses (title, platform, skill, difficulty, estimated_time, reason) VALUES
('Python for Everybody', 'Coursera', 'Python', 'Beginner', '2 months', 'Starts from zero assumptions and walks you through Python with simple real-world examples.'),
('Learn Python - Full Course', 'freeCodeCamp', 'Python', 'Beginner', '4 hours', 'A single free video course that covers all Python basics in one sitting with hands-on examples.'),
('SQL for Data Science', 'Coursera', 'SQL', 'Beginner', '1 month', 'Teaches SQL through practical data-science tasks so you learn by doing real queries.'),
('SQL Basics', 'YouTube', 'SQL', 'Beginner', '3 hours', 'Short clear videos that explain SQL queries with visual examples anyone can follow.'),
('Data Analysis with Python', 'freeCodeCamp', 'Data Analysis', 'Beginner', '6 hours', 'Covers pandas and visualization in a beginner-friendly way with datasets you can explore.'),
('Excel Skills for Business', 'Coursera', 'Excel', 'Beginner', '1 month', 'Builds spreadsheet skills step by step with practical business scenarios and exercises.'),
('Responsive Web Design', 'freeCodeCamp', 'HTML/CSS', 'Beginner', '3 weeks', 'Teaches HTML and CSS by building real projects you can add to your portfolio immediately.'),
('JavaScript Algorithms and Data Structures', 'freeCodeCamp', 'JavaScript', 'Beginner', '3 months', 'Learn JavaScript fundamentals while solving small coding challenges that build confidence.'),
('Beginner JavaScript Tutorial', 'YouTube', 'JavaScript', 'Beginner', '2 hours', 'A quick friendly intro that explains core JavaScript concepts with live coding demos.'),
('React for Beginners', 'YouTube', 'React', 'Beginner', '4 hours', 'Walks through building a React app from scratch so you see how everything fits together.'),
('Effective Communication Skills', 'NPTEL', 'Communication', 'Beginner', '4 weeks', 'A structured college-level course that covers speaking, listening, and professional communication.'),
('Problem Solving Through Programming', 'NPTEL', 'Problem Solving', 'Beginner', '4 weeks', 'Connects problem-solving thinking with basic programming in a way beginners can easily grasp.'),
('Java Programming Basics', 'Coursera', 'Java', 'Beginner', '1 month', 'Introduces Java step by step with guided exercises perfect for first-time programmers.'),
('Cloud Computing Fundamentals', 'YouTube', 'Cloud Basics', 'Beginner', '3 hours', 'Explains cloud concepts in plain English with visuals that make abstract ideas easy to grasp.'),
('C++ Programming Course', 'YouTube', 'C++', 'Beginner', '5 hours', 'A comprehensive beginner walkthrough of C++ syntax and logic with hands-on coding examples.');
