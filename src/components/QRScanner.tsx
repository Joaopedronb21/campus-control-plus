import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { findQRCode, createPresenca } from '@/lib/db/models';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QRCodeData {
  id: string;
  codigo: string;
  materia_id: string;
  turma_id: string;
  data_aula: string;
  ativo: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const qrRef = useRef<Html5Qrcode | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      if (qrRef.current) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode("qr-reader");
      qrRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          disableFlip: false,
          //formats: [Html5QrcodeSupportedFormats.QR_CODE]
        },
        handleScanSuccess,
        handleScanError
      );

      // Timeout após 2 minutos
      scanTimeoutRef.current = setTimeout(() => {
        stopScanner();
        toast({
          title: "Tempo expirado",
          description: "Por favor tente novamente",
          variant: "destructive"
        });
      }, 120000);

    } catch (err) {
      console.error("Error starting scanner:", err);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o scanner. Verifique se permitiu acesso à câmera.",
        variant: "destructive"
      });
    }
  };

  const stopScanner = async () => {
    if (qrRef.current) {
      try {
        await qrRef.current.stop();
        qrRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    if (isScanning) return; // Previne múltiplos scans
    
    setIsScanning(true);
    try {
      await stopScanner();
      
      const qrCode = await findQRCode(decodedText);
      if (!qrCode || !qrCode.ativo) {
        throw new Error('QR Code inválido ou expirado');
      }

      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      await createPresenca({
        aluno_id: user.id,
        materia_id: qrCode.materia_id,
        turma_id: qrCode.turma_id,
        data_aula: qrCode.data_aula,
        presente: true
      });

      toast({
        title: "Sucesso",
        description: "Presença registrada com sucesso!"
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Erro", 
        description: error.message || "Erro ao processar QR Code"
      });
      startScanner(); // Reinicia o scanner em caso de erro
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanError = (error: any) => {
    // Ignora erros de leitura normais
    if (error?.message?.includes('NotFound')) return;
    console.error("Error scanning:", error);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escanear QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div id="qr-reader" style={{ width: '100%' }} />
          <div className="mt-4">
            <Button onClick={onClose} className="w-full">Fechar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
