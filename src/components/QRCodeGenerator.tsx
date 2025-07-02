
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { QrCode } from 'lucide-react';

interface QRCodeGeneratorProps {
  onGenerate?: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onGenerate }) => {
  const [turmaId, setTurmaId] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const generateQRCode = async () => {
    if (!turmaId || !materiaId || !user) return;

    setIsGenerating(true);
    try {
      const codigo = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 2); // Expira em 2 horas

      const { error } = await supabase
        .from('qr_codes_presenca')
        .insert({
          codigo,
          materia_id: materiaId,
          turma_id: turmaId,
          professor_id: user.id,
          data_aula: new Date().toISOString().split('T')[0],
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      setQrCode(codigo);
      toast({
        title: "QR Code gerado",
        description: "QR Code criado com sucesso!"
      });
      
      onGenerate?.();
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar QR Code",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="school-button">
          <QrCode className="h-4 w-4 mr-2" />
          Gerar QR Code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar QR Code para Presença</DialogTitle>
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
          
          <Select value={materiaId} onValueChange={setMateriaId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mat1">Matemática</SelectItem>
              <SelectItem value="mat2">Português</SelectItem>
              <SelectItem value="mat3">História</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={generateQRCode} 
            disabled={!turmaId || !materiaId || isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Gerando...' : 'Gerar QR Code'}
          </Button>

          {qrCode && (
            <div className="text-center p-4 border rounded-lg">
              <div className="text-6xl font-mono break-all mb-4">📱</div>
              <p className="text-sm text-gray-600">Código: {qrCode}</p>
              <p className="text-xs text-gray-500 mt-2">
                QR Code válido por 2 horas
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;
