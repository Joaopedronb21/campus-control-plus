import React, { useState, useEffect } from 'react';
import { mockApi } from '@/lib/mock-api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { BookUser, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';

const StudentSubjectManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Buscar alunos
      const studentsResult = await mockApi.select('profiles', 'id, name, email', { role: 'aluno' });

      if (!user?.id) {
        setStudents(studentsResult.data || []);
        setSubjects([]);
        return;
      }

      // Buscar matérias
      const materiasResult = await mockApi.select('materias', 'id, nome, codigo');

      // Buscar vínculos aluno-turma para exibir
      const alunoTurmasResult = await mockApi.select('aluno_turmas', '*');

      // Se for aluno, buscar suas próprias matérias
      if (user.role === 'aluno') {
        const alunoTurmas = alunoTurmasResult.data?.filter(at => at.aluno_id === user.id) || [];
        
        // Buscar notas do aluno
        const notasResult = await mockApi.select('notas', '*', { aluno_id: user.id });

        // Buscar presenças do aluno
        const presencasResult = await mockApi.select('presencas', '*', { aluno_id: user.id });

        const processedSubjects = [];
        
        for (const alunoTurma of alunoTurmas) {
          // Buscar a turma
          const turmaResult = await mockApi.select('turmas', '*', { id: alunoTurma.turma_id });
          const turma = turmaResult.data?.[0];
          
          if (turma) {
            // Buscar a matéria da turma
            const materiaResult = await mockApi.select('materias', '*', { id: turma.materia_id });
            const materia = materiaResult.data?.[0];
            
            if (materia) {
              // Calcular notas
              const alunoNotas = notasResult.data?.filter(n => n.materia_id === materia.id) || [];
              const mediaNotas = alunoNotas.length > 0 
                ? alunoNotas.reduce((acc, curr) => acc + curr.nota, 0) / alunoNotas.length 
                : 0;

              // Calcular presenças
              const alunoPresencas = presencasResult.data?.filter(p => p.materia_id === materia.id) || [];
              const totalAulas = alunoPresencas.length;
              const aulasPresente = alunoPresencas.filter(p => p.presente).length;
              const frequencia = totalAulas > 0 ? (aulasPresente / totalAulas) * 100 : 0;

              processedSubjects.push({
                id: materia.id,
                nome: materia.nome,
                codigo: materia.codigo,
                turma_nome: turma.nome,
                nota: Number(mediaNotas.toFixed(2)),
                frequencia: Number(frequencia.toFixed(2))
              });
            }
          }
        }

        setSubjects(processedSubjects);
      } else {
        // Para admin/professor
        setMaterias(materiasResult.data || []);
      }

      setStudents(studentsResult.data || []);
      
      // Processar vínculos para exibição
      if (alunoTurmasResult.data) {
        const processedLinks = [];
        
        for (const alunoTurma of alunoTurmasResult.data) {
          const aluno = studentsResult.data?.find(s => s.id === alunoTurma.aluno_id);
          const turmaResult = await mockApi.select('turmas', '*', { id: alunoTurma.turma_id });
          const turma = turmaResult.data?.[0];
          
          if (aluno && turma) {
            const materiaResult = await mockApi.select('materias', '*', { id: turma.materia_id });
            const materia = materiaResult.data?.[0];
            
            processedLinks.push({
              id: alunoTurma.id,
              student_name: aluno.name,
              subject_name: materia?.nome || 'N/A',
              turma_name: turma.nome
            });
          }
        }
        
        setStudentSubjects(processedLinks);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateLink = async () => {
    if (!selectedStudent || !selectedSubject) {
      toast({
        title: "Erro",
        description: "Selecione um aluno e uma matéria",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Primeiro, encontrar uma turma para esta matéria
      const turmaResult = await mockApi.select('turmas', '*', { materia_id: selectedSubject });
      
      if (!turmaResult.data || turmaResult.data.length === 0) {
        toast({
          title: "Erro",
          description: "Nenhuma turma encontrada para esta matéria",
          variant: "destructive"
        });
        return;
      }

      const turma = turmaResult.data[0];

      // Verificar se o aluno já está vinculado a esta turma
      const existingLink = await mockApi.select('aluno_turmas', '*', {
        aluno_id: selectedStudent,
        turma_id: turma.id
      });

      if (existingLink.data && existingLink.data.length > 0) {
        toast({
          title: "Vínculo já existe",
          description: "Este aluno já está vinculado a esta turma",
          variant: "destructive"
        });
        return;
      }

      // Criar o vínculo aluno-turma
      const result = await mockApi.insert('aluno_turmas', {
        aluno_id: selectedStudent,
        turma_id: turma.id,
        data_matricula: new Date().toISOString().split('T')[0]
      });

      if (result.error) throw result.error;

      toast({
        title: "Vínculo criado",
        description: "Aluno vinculado à matéria/turma com sucesso!"
      });
      
      setSelectedStudent('');
      setSelectedSubject('');
      fetchData();
    } catch (error: any) {
      console.error('Error creating link:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar vínculo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const result = await mockApi.delete('aluno_turmas', { id: linkId });

      if (result.error) throw result.error;

      toast({
        title: "Vínculo removido",
        description: "Vínculo removido com sucesso!"
      });
      
      fetchData();
    } catch (error: any) {
      console.error('Error deleting link:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover vínculo",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="school-button">
          <BookUser className="h-4 w-4 mr-2" />
          Vincular Aluno/Matéria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Vínculos Aluno-Matéria</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Criar novo vínculo - só para admin */}
          {user?.role === 'admin' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">Criar Novo Vínculo</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student">Aluno</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Matéria</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      {materias.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.nome} ({subject.codigo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCreateLink} disabled={isLoading} className="w-full">
                {isLoading ? 'Criando...' : 'Criar Vínculo'}
              </Button>
            </div>
          )}

          {/* Lista de vínculos existentes - só para admin */}
          {user?.role === 'admin' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vínculos Existentes</h3>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {studentSubjects.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <p className="text-gray-500">Nenhum vínculo encontrado</p>
                  </div>
                ) : (
                  studentSubjects.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{link.student_name}</span>
                        <span className="text-gray-500 mx-2">→</span>
                        <span>{link.subject_name}</span>
                        <span className="text-gray-500 mx-2">→</span>
                        <span className="text-sm text-gray-600">{link.turma_name}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Matérias e Notas do Aluno */}
          {user?.role === 'aluno' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Minhas Matérias e Notas</h3>
              
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="grid gap-4">
                  {subjects.map((subject) => (
                    <Card key={subject.id}>
                      <CardHeader>
                        <CardTitle>{subject.nome}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm">Código: {subject.codigo}</p>
                            <p className="text-sm">Turma: {subject.turma_nome}</p>
                            <div className="flex gap-2">
                              <Badge variant={subject.nota >= 7 ? "default" : "destructive"}>
                                Média: {subject.nota}
                              </Badge>
                              <Badge variant={subject.frequencia >= 75 ? "default" : "destructive"}>
                                Frequência: {subject.frequencia}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentSubjectManager;