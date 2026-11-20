import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Degree, Role, Company, Course, InterviewQuestion } from '@/types';

export function useNexPathData() {
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [degRes, rolesRes, compRes, courseRes, qRes] = await Promise.all([
          supabase.from('degrees').select('*').order('name'),
          supabase.from('roles').select('*'),
          supabase.from('companies').select('*').order('name'),
          supabase.from('courses').select('*').order('title'),
          supabase.from('interview_questions').select('*').order('sort_order'),
        ]);

        if (degRes.error) throw degRes.error;
        if (rolesRes.error) throw rolesRes.error;
        if (compRes.error) throw compRes.error;
        if (courseRes.error) throw courseRes.error;
        if (qRes.error) throw qRes.error;

        if (!cancelled) {
          setDegrees(degRes.data as Degree[]);
          setRoles(rolesRes.data as Role[]);
          setCompanies(compRes.data as Company[]);
          setCourses(courseRes.data as Course[]);
          setQuestions(qRes.data as InterviewQuestion[]);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { degrees, roles, companies, courses, questions, loading, error };
}
