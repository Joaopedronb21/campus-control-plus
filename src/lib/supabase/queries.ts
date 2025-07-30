import { supabase } from './client';

export async function fetchProfessorStats(professorId: string) {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select(`
      total_alunos,
      novos_alunos,
      media_frequencia,
      taxa_aprovacao,
      evolucao_media
    `)
    .eq('professor_id', professorId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchPerformanceData(professorId: string, metric: 'frequency' | 'grades') {
  const { data, error } = await supabase
    .from('performance_history')
    .select('date, value')
    .eq('professor_id', professorId)
    .eq('metric', metric)
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}
