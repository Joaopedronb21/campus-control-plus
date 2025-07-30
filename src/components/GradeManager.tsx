import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { mockApi } from '@/lib/mock-api';
import { useAuth } from './AuthContext';
import { FileText } from 'lucide-react';

interface Turma {
  id: string;
  nome: string;
}

interface Aluno {
  id: string;
  name: string;
}

interface Grade {
  aluno_id: string;
  turma_id: string;
  professor_id: string;
  nota: number;
  data: string;
}

const GradeManager: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedTurma, setSelectedTurma] = useState('');
  const [selectedAluno, setSelectedAluno] = useState('');
  const [nota, setNota] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Buscar turmas do professor
  useEffect(() => {
    const fetchTurmas = async () => {
      if (!user) return;
      
      const result = await mockApi.select('turmas', 'id, nome', { professor_id: user.id });

      if (result.error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar turmas",
          variant: "destructive"
        });
        return;
      }

      setTurmas(result.data || []);
    };

    fetchTurmas();
  }, [user]);

  // Buscar alunos quando selecionar turma
  useEffect(() => {
    const fetchAlunos = async () => {
      if (!selectedTurma) return;

      const result = await mockApi.select('alunos', 'id, name', { turma_id: selectedTurma });

      if (result.error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar alunos",
          variant: "destructive"
        });
        return;
      }

      setAlunos(result.data || []);
    };

    fetchAlunos();
  }, [selectedTurma]);

  const handleSubmit = async () => {
    if (!selectedTurma || !selectedAluno || !nota) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    try {
      const notaNum = parseFloat(nota);
      if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
        throw new Error('A nota deve ser um número entre 0 e 10');
      }

      const grade: Grade = {
        aluno_id: selectedAluno,
        turma_id: selectedTurma,
        professor_id: user?.id || '',
        nota: notaNum,
        data: new Date().toISOString()
      };

      const result = await mockApi.insert('notas', grade);

      if (result.error) throw result.error;

      toast({
        title: "Sucesso",
        description: "Nota lançada com sucesso!"
      });

      setSelectedAluno('');
      setNota('');
      
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao lançar nota",
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
            <Label>Turma</Label>
            <Select value={selectedTurma} onValueChange={setSelectedTurma}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas.map(turma => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTurma && (
            <div>
              <Label>Aluno</Label>
              <Select value={selectedAluno} onValueChange={setSelectedAluno}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map(aluno => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Nota (0-10)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={nota}
              onChange={e => setNota(e.target.value)}
              placeholder="Digite a nota"
            />
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !selectedTurma || !selectedAluno || !nota}
            className="w-full"
          >
            {isLoading ? "Salvando..." : "Salvar Nota"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradeManager;
