
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Trash2 } from 'lucide-react';

interface Professor {
  id: string;
  name: string;
  email: string;
}

interface Subject {
  id: string;
  nome: string;
  codigo: string;
}

interface Class {
  id: string;
  nome: string;
  serie: string;
}

interface ProfessorSubject {
  id: string;
  professor_id: string;
  materia_id: string;
  turma_id: string;
  professor_name: string;
  subject_name: string;
  class_name: string;
}

const ProfessorSubjectManager: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [professorSubjects, setProfessorSubjects] = useState<ProfessorSubject[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Buscar professores
      const { data: professorsData } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('role', 'professor');

      // Buscar matérias
      const { data: subjectsData } = await supabase
        .from('materias')
        .select('id, nome, codigo');

      // Buscar turmas
      const { data: classesData } = await supabase
        .from('turmas')
        .select('id, nome, serie');

      // Buscar vínculos existentes
      const { data: linksData } = await supabase
        .from('professor_materias')
        .select(`
          id,
          professor_id,
          materia_id,
          turma_id,
          profiles!professor_materias_professor_id_fkey(name),
          materias!professor_materias_materia_id_fkey(nome),
          turmas!professor_materias_turma_id_fkey(nome, serie)
        `);

      setProfessors(professorsData || []);
      setSubjects(subjectsData || []);
      setClasses(classesData || []);
      
      if (linksData) {
        const formattedLinks = linksData.map(link => ({
          id: link.id,
          professor_id: link.professor_id,
          materia_id: link.materia_id,
          turma_id: link.turma_id,
          professor_name: (link.profiles as any)?.name || 'N/A',
          subject_name: (link.materias as any)?.nome || 'N/A',
          class_name: `${(link.turmas as any)?.nome || 'N/A'} - ${(link.turmas as any)?.serie || 'N/A'}`
        }));
        setProfessorSubjects(formattedLinks);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateLink = async () => {
    if (!selectedProfessor || !selectedSubject || !selectedClass) {
      toast({
        title: "Erro",
        description: "Selecione professor, matéria e turma",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('professor_materias')
        .insert({
          professor_id: selectedProfessor,
          materia_id: selectedSubject,
          turma_id: selectedClass
        });

      if (error) throw error;

      toast({
        title: "Vínculo criado",
        description: "Professor vinculado à matéria/turma com sucesso!"
      });
      
      setSelectedProfessor('');
      setSelectedSubject('');
      setSelectedClass('');
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
        .from('professor_materias')
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
          <GraduationCap className="h-4 w-4 mr-2" />
          Vincular Professor/Matéria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Vínculos Professor-Matéria</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Criar novo vínculo */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Criar Novo Vínculo</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="professor">Professor</Label>
                <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {professors.map((professor) => (
                      <SelectItem key={professor.id} value={professor.id}>
                        {professor.name}
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
                        {subject.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="class">Turma</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.nome} - {cls.serie}
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
              {professorSubjects.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum vínculo encontrado</p>
              ) : (
                professorSubjects.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{link.professor_name}</span>
                      <span className="text-gray-500 mx-2">→</span>
                      <span>{link.subject_name}</span>
                      <span className="text-gray-500 mx-2">→</span>
                      <span className="text-sm text-gray-600">{link.class_name}</span>
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

export default ProfessorSubjectManager;
