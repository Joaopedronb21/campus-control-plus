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

      // Buscar notas do aluno
      const notasResult = await mockApi.select('notas', '*', { aluno_id: user.id });

      // Buscar presenças do aluno
      const presencasResult = await mockApi.select('presencas', '*', { aluno_id: user.id });

      const processedSubjects = materiasResult.data?.map(subject => {
        const notas = notasResult.data?.filter(n => n.materia_id === subject.id) || [];
        const presencas = presencasResult.data?.filter(p => p.materia_id === subject.id) || [];
        
        // Calcular média das notas
        const mediaNotas = notas.length > 0 
          ? notas.reduce((acc, curr) => acc + curr.nota, 0) / notas.length
          : 0;
        
        // Calcular frequência
        const totalAulas = presencas.length;
        const aulasPresente = presencas.filter(p => p.presente).length;
        const frequencia = totalAulas > 0 ? (aulasPresente / totalAulas) * 100 : 0;

        return {
          id: subject.id,
          nome: subject.nome,
          codigo: subject.codigo,
          nota: Number(mediaNotas.toFixed(2)),
          frequencia: Number(frequencia.toFixed(2))
        };
      }) || [];

      setStudents(studentsResult.data || []);
      setSubjects(processedSubjects);
      setStudentSubjects([]); // Temporariamente vazio até os tipos serem atualizados
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
      // Por enquanto, vamos usar a tabela aluno_turmas como alternativa
      // até que os tipos sejam atualizados para incluir aluno_materias
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A vinculação aluno-matéria será implementada após a atualização dos tipos do banco.",
        variant: "default"
      });
      
      setSelectedStudent('');
      setSelectedSubject('');
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
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A remoção de vínculos será implementada após a atualização dos tipos do banco.",
        variant: "default"
      });
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
          {/* Criar novo vínculo */}
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
                    {subjects.map((subject) => (
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

          {/* Lista de vínculos existentes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vínculos Existentes</h3>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {studentSubjects.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-gray-500">Funcionalidade em desenvolvimento</p>
                  <p className="text-sm text-gray-400">
                    Os vínculos aluno-matéria serão exibidos aqui após a atualização dos tipos do banco de dados.
                  </p>
                </div>
              ) : (
                studentSubjects.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{link.student_name}</span>
                      <span className="text-gray-500 mx-2">→</span>
                      <span>{link.subject_name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )))
              }

            </div>
          </div>

          {/* Matérias e Notas do Aluno */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default StudentSubjectManager;