import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NetworkInfo } from '@/services/networkService';
import { Wifi, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';

interface ConnectionInfoProps {
  networkInfo: NetworkInfo;
  isLoading: boolean;
}

const ConnectionInfo: React.FC<ConnectionInfoProps> = ({ networkInfo, isLoading }) => {
  const resultRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = async () => {
    if (resultRef.current) {
      try {
        const canvas = await html2canvas(resultRef.current);
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `diagnostico-rede-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
        link.click();
        toast({
          title: "Sucesso",
          description: "Captura de tela foi salva com sucesso!",
        });
      } catch (error) {
        console.error('Error capturing screenshot:', error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar a captura de tela.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div ref={resultRef}>
      <Card className="w-full diagnostic-card">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-diagnostic-green-medium">
              <Wifi className="mr-2" /> Informações da Sua Conexão
            </CardTitle>
            <Button 
              onClick={handleScreenshot} 
              variant="outline" 
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" /> Salvar Resultado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Endereço IPv4</h3>
                  <p className="text-lg font-semibold">{networkInfo.ipv4}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Endereço IPv6</h3>
                  <p className="text-lg font-semibold">
                    {networkInfo.ipv6 || <span className="text-gray-400">Não disponível</span>}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center mt-2">
                <h3 className="text-sm font-medium text-gray-500 mr-2">Status:</h3>
                <Badge 
                  className={
                    networkInfo.connectionType === 'Direct' 
                      ? "bg-diagnostic-green-medium text-white" 
                      : "bg-diagnostic-yellow text-black"
                  }
                >
                  Conexão {networkInfo.connectionType === 'Direct' ? 'Direta' : 'VPN'}
                </Badge>
              </div>
              
              {networkInfo.downloadSpeed !== null && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 pt-4 border-t border-gray-100">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Download</h3>
                    <p className="text-lg font-semibold">{networkInfo.downloadSpeed} <span className="text-sm">Mbps</span></p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Upload</h3>
                    <p className="text-lg font-semibold">{networkInfo.uploadSpeed} <span className="text-sm">Mbps</span></p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Latência</h3>
                    <p className="text-lg font-semibold">{networkInfo.latency} <span className="text-sm">ms</span></p>
                  </div>
                </div>
              )}
              
              {networkInfo.timestamp && (
                <div className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  Teste realizado em: {new Date(networkInfo.timestamp).toLocaleString('pt-BR')}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionInfo;
