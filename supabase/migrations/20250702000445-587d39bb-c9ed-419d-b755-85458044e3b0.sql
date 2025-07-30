-- Criar tabela de usuários para autenticação própria
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'professor', 'aluno')),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de perfis de usuário (referencia usuarios)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES public.usuarios(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'professor', 'aluno')),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de matérias
CREATE TABLE public.materias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de turmas
CREATE TABLE public.turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  serie TEXT NOT NULL,
  ano_letivo INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de vínculos professor-matéria
CREATE TABLE public.professor_materias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  materia_id UUID REFERENCES public.materias(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(professor_id, materia_id, turma_id)
);

-- Criar tabela de vínculos aluno-turma
CREATE TABLE public.aluno_turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, turma_id)
);

-- Criar tabela de provas
CREATE TABLE public.provas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_prova TIMESTAMP WITH TIME ZONE NOT NULL,
  materia_id UUID REFERENCES public.materias(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  valor DECIMAL(5,2) DEFAULT 10.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de notas
CREATE TABLE public.notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  prova_id UUID REFERENCES public.provas(id) ON DELETE CASCADE,
  materia_id UUID REFERENCES public.materias(id) ON DELETE CASCADE,
  nota DECIMAL(5,2) NOT NULL CHECK (nota >= 0 AND nota <= 10),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, prova_id)
);

-- Criar tabela de presenças
CREATE TABLE public.presencas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  materia_id UUID REFERENCES public.materias(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE,
  data_aula DATE NOT NULL,
  presente BOOLEAN NOT NULL DEFAULT false,
  observacoes TEXT,
  qr_code_usado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(aluno_id, materia_id, turma_id, data_aula)
);

-- Criar tabela de QR codes para presença
CREATE TABLE public.qr_codes_presenca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  materia_id UUID REFERENCES public.materias(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  data_aula DATE NOT NULL,
  ativo BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de avisos
CREATE TABLE public.avisos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('prova', 'aviso', 'trabalho', 'geral')),
  autor_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id),
  materia_id UUID REFERENCES public.materias(id),
  data_publicacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_expiracao TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professor_materias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aluno_turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes_presenca ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas RLS para matérias (visível para todos os autenticados)
CREATE POLICY "Authenticated users can view materias" ON public.materias FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage materias" ON public.materias FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas RLS para turmas (visível para todos os autenticados)
CREATE POLICY "Authenticated users can view turmas" ON public.turmas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage turmas" ON public.turmas FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas RLS para vínculos professor-matéria
CREATE POLICY "Professors can view their assignments" ON public.professor_materias FOR SELECT USING (professor_id = auth.uid());
CREATE POLICY "Admins can manage professor assignments" ON public.professor_materias FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas RLS para vínculos aluno-turma
CREATE POLICY "Students can view their assignments" ON public.aluno_turmas FOR SELECT USING (aluno_id = auth.uid());
CREATE POLICY "Admins can manage student assignments" ON public.aluno_turmas FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas RLS para provas
CREATE POLICY "Users can view relevant provas" ON public.provas FOR SELECT TO authenticated USING (
  professor_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.aluno_turmas WHERE aluno_id = auth.uid() AND turma_id = provas.turma_id) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Professors and admins can manage provas" ON public.provas FOR ALL TO authenticated USING (
  professor_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas RLS para notas
CREATE POLICY "Users can view relevant notas" ON public.notas FOR SELECT TO authenticated USING (
  aluno_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.provas WHERE id = notas.prova_id AND professor_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Professors and admins can manage notas" ON public.notas FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.provas WHERE id = notas.prova_id AND professor_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas RLS para presenças
CREATE POLICY "Users can view relevant presencas" ON public.presencas FOR SELECT TO authenticated USING (
  aluno_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.professor_materias WHERE professor_id = auth.uid() AND materia_id = presencas.materia_id AND turma_id = presencas.turma_id) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Professors and admins can manage presencas" ON public.presencas FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.professor_materias WHERE professor_id = auth.uid() AND materia_id = presencas.materia_id AND turma_id = presencas.turma_id) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas RLS para QR codes
CREATE POLICY "Professors can manage their qr codes" ON public.qr_codes_presenca FOR ALL USING (professor_id = auth.uid());
CREATE POLICY "Students can view active qr codes" ON public.qr_codes_presenca FOR SELECT TO authenticated USING (
  ativo = true AND expires_at > NOW() AND
  EXISTS (SELECT 1 FROM public.aluno_turmas WHERE aluno_id = auth.uid() AND turma_id = qr_codes_presenca.turma_id)
);

-- Políticas RLS para avisos
CREATE POLICY "Users can view relevant avisos" ON public.avisos FOR SELECT TO authenticated USING (
  turma_id IS NULL OR
  EXISTS (SELECT 1 FROM public.aluno_turmas WHERE aluno_id = auth.uid() AND turma_id = avisos.turma_id) OR
  EXISTS (SELECT 1 FROM public.professor_materias WHERE professor_id = auth.uid() AND turma_id = avisos.turma_id) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Professors and admins can manage avisos" ON public.avisos FOR ALL TO authenticated USING (
  autor_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Inserir dados de exemplo
INSERT INTO public.materias (nome, codigo, descricao) VALUES
('Matemática', 'MAT001', 'Matemática fundamental e avançada'),
('Português', 'POR001', 'Língua portuguesa e literatura'),
('História', 'HIS001', 'História geral e do Brasil'),
('Geografia', 'GEO001', 'Geografia física e humana'),
('Física', 'FIS001', 'Física geral e aplicada'),
('Química', 'QUI001', 'Química geral e orgânica'),
('Biologia', 'BIO001', 'Biologia geral e molecular'),
('Inglês', 'ING001', 'Língua inglesa');

INSERT INTO public.turmas (nome, serie, ano_letivo) VALUES
('Turma A', '1º Ano', 2024),
('Turma B', '1º Ano', 2024),
('Turma A', '2º Ano', 2024),
('Turma B', '2º Ano', 2024),
('Turma A', '3º Ano', 2024),
('Turma B', '3º Ano', 2024);

-- Desabilita a exigência de confirmação de e-mail para login (redundância para garantir em todas as migrações)
update auth.config set require_email_confirmation = false;
('Turma B', '1º Ano', 2024),
('Turma A', '2º Ano', 2024),
('Turma B', '2º Ano', 2024),
('Turma A', '3º Ano', 2024),
('Turma B', '3º Ano', 2024);

-- Desabilita a exigência de confirmação de e-mail para login (redundância para garantir em todas as migrações)
update auth.config set require_email_confirmation = false;
