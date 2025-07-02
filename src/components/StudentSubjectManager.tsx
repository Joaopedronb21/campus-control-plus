
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BookUser, Trash2 } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Subject {
  id: string;
  nome: string;
  codigo: string;
}

interface StudentSubject {
  id: string;
  aluno_id: string;
  materia_id: string;
  student_name: string;
  subject_name: string;
}

const StudentSubjectManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<StudentSubject[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Buscar alunos
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('role', 'aluno');

      // Buscar matérias
      const { data: subjectsData } = await supabase
        .from('materias')
        .select('id, nome, codigo');

      // Buscar vínculos existentes
      const { data: linksData } = await supabase
        .from('aluno_materias')
        .select(`
          id,
          aluno_id,
          materia_id,
          profiles!aluno_materias_aluno_id_fkey(name),
          materias!aluno_materias_materia_id_fkey(nome)
        `);

      setStudents(studentsData || []);
      setSubjects(subjectsData || []);
      
      if (linksData) {
        const formattedLinks = linksData.map(link => ({
          id: link.id,
          aluno_id: link.aluno_id,
          materia_id: link.materia_id,
          student_name: (link.profiles as any)?.name || 'N/A',
          subject_name: (link.materias as any)?.nome || 'N/A'
        }));
        setStudentSubjects(formattedLinks);
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
      const { error } = await supabase
        .from('aluno_materias')
        .insert({
          aluno_id: selectedStudent,
          materia_id: selectedSubject
        });

      if (error) throw error;

      toast({
        title: "Vínculo criado",
        description: "Aluno vinculado à matéria com sucesso!"
      });
      
      setSelectedStudent('');
      setSelectedSubject('');
      fetchData();
    } catch (error: any) {
      console.error('Error creating link:', error);
      toast({
        title: "Erro",
        description: error.message.includes('duplicate') ? 'Este vínculo já existe' : 'Erro ao criar vínculo',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('aluno_materias')
        .delete()
        .eq('id', linkId);

      if (error) throw error;

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
                <p className="text-gray-500 text-center py-4">Nenhum vínculo encontrado</p>
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
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentSubjectManager;
