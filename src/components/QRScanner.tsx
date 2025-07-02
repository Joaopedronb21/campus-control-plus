
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { QrCode } from 'lucide-react';

const QRScanner: React.FC = () => {
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleScanQR = async () => {
    if (!qrCode || !user) return;

    setIsScanning(true);
    try {
      // Verificar se o QR Code existe e está ativo
      const { data: qrData, error: qrError } = await supabase
        .from('qr_codes_presenca')
        .select('*')
        .eq('codigo', qrCode)
        .eq('ativo', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (qrError || !qrData) {
        toast({
          title: "QR Code inválido",
          description: "QR Code não encontrado ou expirado",
          variant: "destructive"
        });
        return;
      }

      // Registrar presença
      const { error: presencaError } = await supabase
        .from('presencas')
        .upsert({
          aluno_id: user.id,
          turma_id: qrData.turma_id,
          materia_id: qrData.materia_id,
          data_aula: qrData.data_aula,
          presente: true,
          qr_code_usado: true
        }, {
          onConflict: 'aluno_id,materia_id,turma_id,data_aula'
        });

      if (presencaError) throw presencaError;

      toast({
        title: "Presença confirmada",
        description: "Sua presença foi registrada com sucesso!"
      });
      
      setQrCode('');
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar presença",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="school-button">
          <QrCode className="h-4 w-4 mr-2" />
          Registrar Presença
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escanear QR Code</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">
              Digite o código QR ou escaneie com a câmera
            </p>
          </div>

          <div>
            <Label htmlFor="qrcode">Código QR</Label>
            <Input
              id="qrcode"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              placeholder="Digite ou cole o código aqui"
            />
          </div>

          <Button 
            onClick={handleScanQR} 
            disabled={!qrCode || isScanning}
            className="w-full"
          >
            {isScanning ? 'Registrando...' : 'Confirmar Presença'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
