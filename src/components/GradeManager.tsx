
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { FileText } from 'lucide-react';

const GradeManager: React.FC = () => {
  const [turmaId, setTurmaId] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [nota, setNota] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmitGrade = async () => {
    if (!turmaId || !alunoId || !nota || !user) return;

    const notaNum = parseFloat(nota);
    if (notaNum < 0 || notaNum > 10) {
      toast({
        title: "Erro",
        description: "A nota deve estar entre 0 e 10",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('notas')
        .insert({
          aluno_id: alunoId,
          materia_id: 'mat1', // Exemplo - seria dinâmico
          nota: notaNum,
          observacoes: 'Nota lançada pelo professor'
        });

      if (error) throw error;

      toast({
        title: "Nota lançada",
        description: "Nota registrada com sucesso!"
      });
      
      // Limpar formulário
      setTurmaId('');
      setAlunoId('');
      setNota('');
    } catch (error) {
      console.error('Error submitting grade:', error);
      toast({
        title: "Erro",
        description: "Erro ao lançar nota",
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
          <FileText className="h-4 w-4 mr-2" />
          Lançar Notas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lançar Notas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="turma">Turma</Label>
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
          </div>
          
          <div>
            <Label htmlFor="aluno">Aluno</Label>
            <Select value={alunoId} onValueChange={setAlunoId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o aluno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluno1">João Silva</SelectItem>
                <SelectItem value="aluno2">Maria Santos</SelectItem>
                <SelectItem value="aluno3">Pedro Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nota">Nota (0-10)</Label>
            <Input
              id="nota"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Digite a nota"
            />
          </div>

          <Button 
            onClick={handleSubmitGrade} 
            disabled={!turmaId || !alunoId || !nota || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Lançando...' : 'Lançar Nota'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradeManager;
