-- Criar contas de demonstração
INSERT INTO public.usuarios (id, email, senha, name, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@escola.com', crypt('123456', gen_salt('bf')), 'Administrador', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'professor@escola.com', crypt('123456', gen_salt('bf')), 'Professor Silva', 'professor'),
  ('33333333-3333-3333-3333-333333333333', 'aluno@escola.com', crypt('123456', gen_salt('bf')), 'João Aluno', 'aluno');

-- Inserir perfis correspondentes
INSERT INTO public.profiles (id, name, email, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Administrador', 'admin@escola.com', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Professor Silva', 'professor@escola.com', 'professor'),
  ('33333333-3333-3333-3333-333333333333', 'João Aluno', 'aluno@escola.com', 'aluno');

-- Criar alguns vínculos de exemplo
INSERT INTO public.professor_materias (professor_id, materia_id, turma_id) 
SELECT 
  '22222222-2222-2222-2222-222222222222',
  m.id,
  t.id
FROM public.materias m, public.turmas t 
WHERE m.codigo = 'MAT001' AND t.nome = 'Turma A' AND t.serie = '1º Ano'
LIMIT 1;

INSERT INTO public.aluno_turmas (aluno_id, turma_id)
SELECT 
  '33333333-3333-3333-3333-333333333333',
  t.id
FROM public.turmas t 
WHERE t.nome = 'Turma A' AND t.serie = '1º Ano'
LIMIT 1;

-- Permitir admins inserir novos perfis
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT TO authenticated 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Permitir admins gerenciar vínculos aluno-matéria (tabela intermediária)
CREATE TABLE IF NOT EXISTS public.aluno_materias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  materia_id UUID REFERENCES public.materias(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, materia_id)
);

ALTER TABLE public.aluno_materias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage student-subject assignments" ON public.aluno_materias FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Students can view their subject assignments" ON public.aluno_materias FOR SELECT USING (aluno_id = auth.uid());

-- Desabilita a exigência de confirmação de e-mail para login
-- Isso só é necessário se você estiver usando o pacote de autenticação padrão do Supabase
-- e quer garantir que o usuário possa logar imediatamente após o cadastro.

-- Atualize a tabela de configuração do auth caso exista:
update auth.config set require_email_confirmation = false;

-- Garante que todos os usuários já estejam com o e-mail confirmado
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
