import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockApi } from '@/lib/mock-api';
import { QrCode, Camera, Type } from 'lucide-react';
import { useAuth } from './AuthContext';

const QrCodeScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [useManual, setUseManual] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleScan = async (qrCode: string) => {
    if (!user) return;

    try {
      // Verificar se o QR code é válido e ativo
      const qrResult = await mockApi.select('qr_codes_presenca', '*', { 
        codigo: qrCode, 
        ativo: true 
      });

      if (!qrResult.data || qrResult.data.length === 0) {
        throw new Error('QR Code inválido ou expirado');
      }

      const qrData = qrResult.data[0];

      // Verificar se o QR code ainda está dentro do prazo
      const now = new Date();
      const expireTime = new Date(qrData.expires_at);
      
      if (now > expireTime) {
        throw new Error('QR Code expirado');
      }

      // Verificar se o aluno já registrou presença para esta aula
      const existingPresenca = await mockApi.select('presencas', '*', {
        aluno_id: user.id,
        materia_id: qrData.materia_id,
        turma_id: qrData.turma_id,
        data_aula: qrData.data_aula
      });

      if (existingPresenca.data && existingPresenca.data.length > 0) {
        toast({
          title: "Presença já registrada",
          description: "Você já registrou presença para esta aula",
          variant: "destructive"
        });
        return;
      }

      // Registrar presença
      const presencaResult = await mockApi.insert('presencas', {
        aluno_id: user.id,
        materia_id: qrData.materia_id,
        turma_id: qrData.turma_id,
        data_aula: qrData.data_aula,
        presente: true,
        qr_code_usado: true
      });

      if (presencaResult.error) throw presencaResult.error;

      toast({
        title: "Presença registrada",
        description: "Sua presença foi registrada com sucesso!",
      });

      setManualCode('');

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao registrar presença",
        variant: "destructive"
      });
    }
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Digite o código QR",
        variant: "destructive"
      });
      return;
    }
    
    handleScan(manualCode.trim());
  };

  const simulateCameraScan = () => {
    setScanning(true);
    
    // Simular delay de escaneamento
    setTimeout(() => {
      setScanning(false);
      
      // Usar um código QR de exemplo dos dados mock
      const exampleCode = 'QR-MAT001-20240130-1';
      handleScan(exampleCode);
    }, 2000);
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
          <DialogTitle>Registrar Presença via QR Code</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Modo de escaneamento */}
          <div className="flex gap-2">
            <Button
              variant={!useManual ? "default" : "outline"}
              onClick={() => setUseManual(false)}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              Câmera
            </Button>
            <Button
              variant={useManual ? "default" : "outline"}
              onClick={() => setUseManual(true)}
              className="flex-1"
            >
              <Type className="h-4 w-4 mr-2" />
              Manual
            </Button>
          </div>

          {/* Interface de câmera simulada */}
          {!useManual && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {scanning ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <Camera className="h-16 w-16 mx-auto text-blue-500" />
                    </div>
                    <p className="text-lg font-medium">Escaneando...</p>
                    <p className="text-sm text-gray-500">
                      Mantenha o QR code dentro da área de foco
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <QrCode className="h-16 w-16 mx-auto text-gray-400" />
                    <p className="text-lg font-medium">Aponte a câmera para o QR Code</p>
                    <p className="text-sm text-gray-500">
                      QR Code mostrado pelo professor na tela
                    </p>
                    <Button onClick={simulateCameraScan} disabled={scanning}>
                      Simular Escaneamento
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interface manual */}
          {useManual && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-code">Código QR</Label>
                <Input
                  id="manual-code"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Digite o código QR (ex: QR-MAT001-20240130-1)"
                />
              </div>
              
              <Button onClick={handleManualSubmit} className="w-full">
                Registrar Presença
              </Button>
              
              <div className="text-sm text-gray-500 text-center">
                <p>Para teste, use o código: <code className="bg-gray-100 px-2 py-1 rounded">QR-MAT001-20240130-1</code></p>
              </div>
            </div>
          )}

          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Como usar:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• O professor exibirá o QR code na tela</li>
              <li>• Escaneie com a câmera ou digite o código manualmente</li>
              <li>• A presença será registrada automaticamente</li>
              <li>• QR codes expiram em 30 minutos</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeScanner;
