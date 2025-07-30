import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { QrCode, UserCheck } from 'lucide-react';

interface Turma {
  id: string;
  nome: string;
}

interface Materia {
  id: string;
  nome: string;
}

const AttendanceManager = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedTurma, setSelectedTurma] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTurmasAndMaterias();
  }, []);

  const fetchTurmasAndMaterias = async () => {
    try {
      // Buscar turmas
      const { data: turmasData } = await supabase
        .from('turmas')
        .select('id, nome');
      
      // Buscar matérias
      const { data: materiasData } = await supabase
        .from('materias')
        .select('id, nome');

      if (turmasData) setTurmas(turmasData);
      if (materiasData) setMaterias(materiasData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const generateQRCode = async () => {
    if (!selectedTurma || !selectedMateria) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione uma turma e uma matéria",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const code = `${selectedTurma}-${selectedMateria}-${Date.now()}`;
      
      // Verificar se já existe QR code ativo para esta aula
      const { data: existingQR } = await supabase
        .from('qr_codes_presenca')
        .select('*')
        .eq('turma_id', selectedTurma)
        .eq('materia_id', selectedMateria)
        .eq('data_aula', new Date().toISOString().split('T')[0])
        .eq('ativo', true)
        .single();

      if (existingQR) {
        toast({
          title: "QR Code já existe",
          description: "Já existe um QR Code ativo para esta aula hoje",
          variant: "destructive"
        });
        return;
      }

      // Criar novo QR code
      const { error } = await supabase.from('qr_codes_presenca').insert({
        codigo: code,
        turma_id: selectedTurma,
        materia_id: selectedMateria,
        data_aula: new Date().toISOString(),
        ativo: true,
        expires_at: new Date(Date.now() + 30 * 60000).toISOString() // Expira em 30 minutos
      });

      if (error) throw error;

      setQrCodeValue(code);
      toast({
        title: "QR Code gerado",
        description: "QR Code gerado com sucesso! Expira em 30 minutos.",
      });

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar QR Code. Tente novamente.",
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
          Controle de Presença
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerar QR Code para Presença</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Turma</Label>
            <Select value={selectedTurma} onValueChange={setSelectedTurma}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas.map((turma) => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Matéria</Label>
            <Select value={selectedMateria} onValueChange={setSelectedMateria}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a matéria" />
              </SelectTrigger>
              <SelectContent>
                {materias.map((materia) => (
                  <SelectItem key={materia.id} value={materia.id}>
                    {materia.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateQRCode}
            disabled={isLoading || !selectedTurma || !selectedMateria}
            className="w-full"
          >
            {isLoading ? 'Gerando...' : 'Gerar QR Code'}
            <QrCode className="h-4 w-4 ml-2" />
          </Button>

          {qrCodeValue && (
            <div className="mt-4 p-4 border rounded">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCodeValue}`}
                alt="QR Code para presença"
                className="mx-auto"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceManager;
