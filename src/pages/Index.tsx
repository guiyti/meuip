import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { NetworkInfo, SpeedTestProgress, getNetworkInfo, runSpeedTest } from '@/services/networkService';
import ConnectionInfo from '@/components/ConnectionInfo';
import SpeedTestModal from '@/components/SpeedTestModal';
import SpeedTestResults from '@/components/SpeedTestResults';
import { Activity } from 'lucide-react';

const Index = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [testProgress, setTestProgress] = useState<SpeedTestProgress>({
    phase: 'download',
    progress: 0,
    currentValue: 0,
    unit: 'Mbps',
    downloadSeries: [],
    uploadSeries: [],
    latencySeries: []
  });
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        setIsLoading(true);
        const info = await getNetworkInfo();
        setNetworkInfo(info);
      } catch (error) {
        console.error('Error fetching network info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkInfo();
  }, []);

  const handleStartTest = async (location: string) => {
    if (!networkInfo) return;
    
    try {
      setIsModalOpen(false);
      setIsTestRunning(true);
      setShowResults(true);
      
      const result = await runSpeedTest(location, (progress) => {
        setTestProgress(progress);
      });
      
      // Update network info with test results
      setNetworkInfo({
        ...networkInfo,
        downloadSpeed: result.downloadSpeed,
        uploadSpeed: result.uploadSpeed,
        latency: result.latency,
        timestamp: result.timestamp,
      });
      
    } catch (error) {
      console.error('Error running speed test:', error);
    } finally {
      setIsTestRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-diagnostic-green-dark text-white">
        <div className="container mx-auto py-6">
          <div className="flex items-center">
            <img 
              src="https://www.ufabc.edu.br/images/conteudo/logo2.png" 
              alt="UFABC Logo" 
              className="h-16 mr-4"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <Activity className="mr-2" /> Universidade Federal do ABC
              </h1>
              <p className="mt-2 text-gray-200">
                Teste institucional da rede acadêmica
              </p>
              <p className="text-sm text-gray-300">
                Núcleo de Tecnologia da Informação - NTI
              </p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 gap-8">
          {showResults && (
            <SpeedTestResults 
              testProgress={testProgress}
              showResults={showResults}
            />
          )}
          
          <div>
            <ConnectionInfo 
              networkInfo={networkInfo || {
                ipv4: '',
                ipv6: null,
                connectionType: 'Direct',
                downloadSpeed: null,
                uploadSpeed: null,
                latency: null,
                timestamp: null
              }} 
              isLoading={isLoading} 
            />
            
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={isLoading || isTestRunning}
                className="btn-diagnostic flex items-center"
              >
                {isTestRunning ? 'Teste em Andamento...' : 'Realizar Teste de Velocidade'}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <SpeedTestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onStartTest={handleStartTest} 
      />
      
      <footer className="bg-diagnostic-green-dark text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Serviço de Diagnóstico de Rede</p>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
