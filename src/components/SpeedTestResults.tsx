import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SpeedTestProgress } from '@/services/networkService';
import { Download, Upload, Clock, Save } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';

interface SpeedTestResultsProps {
  testProgress: SpeedTestProgress;
  showResults: boolean;
}

const SpeedTestResults: React.FC<SpeedTestResultsProps> = ({ 
  testProgress,
  showResults 
}) => {
  const resultRef = useRef<HTMLDivElement>(null);
  
  const getPhaseIcon = () => {
    switch (testProgress.phase) {
      case 'download':
        return <Download className="mr-2 text-diagnostic-green-medium" />;
      case 'upload':
        return <Upload className="mr-2 text-diagnostic-green-medium" />;
      case 'latency':
        return <Clock className="mr-2 text-diagnostic-green-medium" />;
      default:
        return null;
    }
  };
  
  const getPhaseTitle = () => {
    switch (testProgress.phase) {
      case 'download':
        return 'Teste de Download';
      case 'upload':
        return 'Teste de Upload';
      case 'latency':
        return 'Teste de Latência';
      case 'complete':
        return 'Diagnóstico Completo';
      default:
        return 'Teste em Progresso';
    }
  };
  
  const data = Array(10).fill(0).map((_, index) => ({
    name: `${index + 1}`,
    download: testProgress.downloadSeries[index] || null,
    upload: testProgress.uploadSeries[index] || null,
  }));
  
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
  
  // Don't render if no test has been run or results shouldn't be shown
  if (!showResults || (testProgress.downloadSeries.length === 0 && testProgress.uploadSeries.length === 0)) {
    return null;
  }
  
  return (
    <div ref={resultRef}>
      <Card className="w-full diagnostic-card mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-diagnostic-green-medium">
              {getPhaseIcon()} Diagnóstico de Rede: {getPhaseTitle()}
            </CardTitle>
            
            {testProgress.phase === 'complete' && (
              <Button 
                onClick={handleScreenshot} 
                variant="outline" 
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" /> Salvar Resultado
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testProgress.phase !== 'complete' && (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-500">Progresso:</span>
                  <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
                    <div 
                      className="h-2 bg-diagnostic-green-medium rounded-full" 
                      style={{ width: `${testProgress.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{testProgress.currentValue.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 ml-1">{testProgress.unit}</span>
                </div>
              </div>
            )}
            
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => value.toFixed(2)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="download" 
                    name="Download"
                    stroke="#05672E" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6, fill: '#FFD200' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="upload" 
                    name="Upload"
                    stroke="#FFD200" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6, fill: '#05672E' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeedTestResults;
