import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QrCode } from 'lucide-react';
import { useAuth } from './AuthContext';

const QrCodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleScan = async (qrCode: string) => {
    if (!user) return;

    try {
      // Verificar se o QR code é válido e ativo
      const { data: qrData } = await supabase
        .from('qr_codes_presenca')
        .select('*')
        .eq('codigo', qrCode)
        .eq('ativo', true)
        .single();

      if (!qrData) {
        throw new Error('QR Code inválido ou expirado');
      }

      // Registrar presença
      const { error } = await supabase.from('presencas').insert({
        aluno_id: user.id,
        materia_id: qrData.materia_id,
        turma_id: qrData.turma_id,
        data_aula: qrData.data_aula,
        presente: true,
        qr_code_usado: true
      });

      if (error) throw error;

      toast({
        title: "Presença registrada",
        description: "Sua presença foi registrada com sucesso!",
      });

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar presença",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode className="h-4 w-4 mr-2" />
          Registrar Presença
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escanear QR Code</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Aqui você pode adicionar a biblioteca de sua preferência para leitura de QR Code */}
          {/* Exemplo: react-qr-reader, zxing, etc */}
          
          <div className="text-center">
            <p>Aponte a câmera para o QR Code mostrado pelo professor</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeScanner;
