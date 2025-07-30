import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { mockApi } from '@/lib/mock-api';
import { useAuth } from './AuthContext';
import { UserCheck, Save } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  presente?: boolean;
}

const AttendanceList: React.FC = () => {
  const [selectedTurma, setSelectedTurma] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [turmas, setTurmas] = useState<any[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    if (!user || user.role !== 'professor') return;

    try {
      // Buscar turmas e matérias do professor
      const professorMaterias = await mockApi.select('professor_materias', '*', { professor_id: user.id });
      
      if (professorMaterias.data) {
        const turmaIds = [...new Set(professorMaterias.data.map(pm => pm.turma_id))];
        const materiaIds = [...new Set(professorMaterias.data.map(pm => pm.materia_id))];
        
        const turmasResult = await mockApi.select('turmas', '*');
        const materiasResult = await mockApi.select('materias', '*');
        
        setTurmas(turmasResult.data?.filter(t => turmaIds.includes(t.id)) || []);
        setMaterias(materiasResult.data?.filter(m => materiaIds.includes(m.id)) || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchStudents = async () => {
    if (!selectedTurma) return;

    try {
      // Buscar alunos da turma
      const alunoTurmas = await mockApi.select('aluno_turmas', '*', { turma_id: selectedTurma });
      
      if (alunoTurmas.data) {
        const studentIds = alunoTurmas.data.map(at => at.aluno_id);
        const studentsResult = await mockApi.select('profiles', '*', { role: 'aluno' });
        
        const turmaStudents = studentsResult.data?.filter(s => studentIds.includes(s.id)) || [];
        
        // Verificar presenças existentes para hoje
        const today = new Date().toISOString().split('T')[0];
        const presencasResult = await mockApi.select('presencas', '*', {
          turma_id: selectedTurma,
          materia_id: selectedMateria,
          data_aula: today
        });

        const studentsWithAttendance = turmaStudents.map(student => ({
          ...student,
          presente: presencasResult.data?.some(p => p.aluno_id === student.id && p.presente) || false
        }));

        setStudents(studentsWithAttendance);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar alunos",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (selectedTurma && selectedMateria) {
      fetchStudents();
    }
  }, [selectedTurma, selectedMateria]);

  const handleAttendanceChange = (studentId: string, presente: boolean) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, presente }
          : student
      )
    );
  };

  const saveAttendance = async () => {
    if (!selectedTurma || !selectedMateria) {
      toast({
        title: "Seleção obrigatória",
        description: "Selecione uma turma e matéria",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Remover presenças existentes para esta aula
      await mockApi.delete('presencas', {
        turma_id: selectedTurma,
        materia_id: selectedMateria,
        data_aula: today
      });

      // Inserir novas presenças
      const presencas = students.map(student => ({
        aluno_id: student.id,
        materia_id: selectedMateria,
        turma_id: selectedTurma,
        data_aula: today,
        presente: student.presente || false,
        qr_code_usado: false
      }));

      for (const presenca of presencas) {
        await mockApi.insert('presencas', presenca);
      }

      const totalPresentes = students.filter(s => s.presente).length;
      
      toast({
        title: "Presença salva",
        description: `Presença registrada para ${totalPresentes} de ${students.length} alunos`
      });

    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar presença",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <UserCheck className="h-4 w-4 mr-2" />
          Lista de Presença
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Controle de Presença por Lista</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filtros */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Turma</Label>
              <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map(turma => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome} - {turma.serie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Matéria</Label>
              <Select value={selectedMateria} onValueChange={setSelectedMateria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a matéria" />
                </SelectTrigger>
                <SelectContent>
                  {materias.map(materia => (
                    <SelectItem key={materia.id} value={materia.id}>
                      {materia.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de alunos */}
          {students.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Lista de Alunos ({students.filter(s => s.presente).length}/{students.length} presentes)
                </h3>
                <Button 
                  onClick={saveAttendance} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Salvando...' : 'Salvar Presença'}
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Presente</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Checkbox
                            checked={student.presente || false}
                            onCheckedChange={(checked) => 
                              handleAttendanceChange(student.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-gray-600">{student.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {selectedTurma && selectedMateria && students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum aluno encontrado para esta turma
            </div>
          )}

          {(!selectedTurma || !selectedMateria) && (
            <div className="text-center py-8 text-gray-500">
              Selecione uma turma e matéria para ver a lista de alunos
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceList;
