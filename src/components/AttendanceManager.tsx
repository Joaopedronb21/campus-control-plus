
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { CheckCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  present: boolean;
}

const AttendanceManager: React.FC = () => {
  const [turmaId, setTurmaId] = useState('');
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'João Silva', present: false },
    { id: '2', name: 'Maria Santos', present: false },
    { id: '3', name: 'Pedro Costa', present: false },
    { id: '4', name: 'Ana Oliveira', present: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, present } : student
      )
    );
  };

  const handleSubmitAttendance = async () => {
    if (!turmaId || !user) return;

    setIsSubmitting(true);
    try {
      const attendanceRecords = students.map(student => ({
        aluno_id: student.id,
        turma_id: turmaId,
        materia_id: 'mat1', // Exemplo - seria dinâmico
        data_aula: new Date().toISOString().split('T')[0],
        presente: student.present
      }));

      const { error } = await supabase
        .from('presencas')
        .upsert(attendanceRecords, {
          onConflict: 'aluno_id,materia_id,turma_id,data_aula'
        });

      if (error) throw error;

      toast({
        title: "Presença registrada",
        description: "Frequência salva com sucesso!"
      });
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar presença",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CheckCircle className="h-4 w-4 mr-2" />
          Registrar Presença
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Presença</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={turmaId} onValueChange={setTurmaId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="turma1">3º Ano A</SelectItem>
              <SelectItem value="turma2">2º Ano B</SelectItem>
              <SelectItem value="turma3">1º Ano C</SelectItem>
            </SelectContent>
          </Select>

          {turmaId && (
            <div className="space-y-3">
              <h4 className="font-medium">Marcar presença dos alunos:</h4>
              {students.map(student => (
                <div key={student.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={student.id}
                    checked={student.present}
                    onCheckedChange={(checked) => 
                      handleAttendanceChange(student.id, checked as boolean)
                    }
                  />
                  <label htmlFor={student.id} className="text-sm">
                    {student.name}
                  </label>
                </div>
              ))}
            </div>
          )}

          <Button 
            onClick={handleSubmitAttendance} 
            disabled={!turmaId || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Presença'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceManager;
