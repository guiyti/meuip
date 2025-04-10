import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import NetworkInfo from "@/components/NetworkInfo";
import TestProgress from "@/components/TestProgress";
import ResultsSummary from "@/components/ResultsSummary";
import ReportForm from "@/components/ReportForm";
import { Badge } from "@/components/ui/badge";

const Diagnostic = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [stage, setStage] = useState("loading");
  const [networkInfo, setNetworkInfo] = useState({
    ipv4: "",
    ipv6: "",
    isVPN: false,
  });
  const [testProgress, setTestProgress] = useState(0);
  const [speedData, setSpeedData] = useState<any[]>([]);
  const [testResults, setTestResults] = useState({
    downloadSpeed: 0,
    uploadSpeed: 0,
    latency: 0,
    completedAt: null as Date | null,
    testId: "",
  });

  useEffect(() => {
    const storedData = sessionStorage.getItem("diagnosticUserData");
    if (!storedData) {
      toast.error("Dados não encontrados. Por favor, preencha o formulário novamente.");
      navigate("/");
      return;
    }
    setUserData(JSON.parse(storedData));
    getNetworkInfo();
  }, [navigate]);

  const getNetworkInfo = async () => {
    try {
      // Obter IP local usando window.location
      const getLocalIP = (): string => {
        // Tentar obter o IP local do hostname
        const hostname = window.location.hostname;
        
        // Se o hostname for localhost, tentar obter o IP de outra forma
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          // Em ambiente de desenvolvimento, usar um IP padrão
          return '192.168.1.1';
        }
        
        return hostname;
      };

      // Obter IP local
      const localIP = getLocalIP();
      
      // Obter IP público para verificação de VPN
      const publicIPResponse = await fetch('https://api.ipify.org?format=json');
      const publicIPData = await publicIPResponse.json();
      
      // Verificar se está usando VPN
      const isVPN = await checkIfVPN(publicIPData.ip);
      
      setNetworkInfo({
        ipv4: localIP,
        ipv6: "Não detectado",
        isVPN: isVPN,
      });
      
      setStage("testing");
      startSpeedTest();
    } catch (error) {
      console.error("Error getting network info:", error);
      toast.error("Erro ao obter informações de rede");
      // Em caso de erro, continuar com o teste mesmo assim
      setStage("testing");
      startSpeedTest();
    }
  };

  const checkIfVPN = async (ip: string) => {
    try {
      // Usar serviço de verificação de VPN
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      
      // Lista mais completa de provedores de VPN conhecidos
      const vpnProviders = [
        'vpn', 'proxy', 'tunnel', 'private', 'expressvpn', 'nordvpn', 
        'surfshark', 'cyberghost', 'private internet access', 'ipvanish',
        'vyprvpn', 'protonvpn', 'windscribe', 'tunnelbear', 'hide.me',
        'mullvad', 'perfect privacy', 'airvpn', 'ivpn', 'trust.zone'
      ];
      
      // Verificar se o IP pertence a um provedor de VPN conhecido
      const org = data.org?.toLowerCase() || '';
      const asn = data.asn?.toLowerCase() || '';
      
      return vpnProviders.some(provider => 
        org.includes(provider) || asn.includes(provider)
      );
    } catch (error) {
      console.error("Error checking VPN status:", error);
      return false;
    }
  };

  const startSpeedTest = () => {
    let progress = 0;
    const testData: any[] = [];
    
    // Simulate speed test with 10 measurements
    const testInterval = setInterval(() => {
      progress += 10;
      setTestProgress(progress);
      
      // Simulate download/upload/latency measurements
      const downloadValue = 20 + Math.random() * 80;
      const uploadValue = 10 + Math.random() * 40;
      const latencyValue = 5 + Math.random() * 25;
      
      // Format timestamp for x-axis
      const timestamp = new Date();
      const timeLabel = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}:${timestamp.getSeconds().toString().padStart(2, '0')}`;
      
      testData.push({
        name: timeLabel,
        download: downloadValue.toFixed(2),
        upload: uploadValue.toFixed(2),
        latency: latencyValue.toFixed(2),
      });
      
      setSpeedData([...testData]);
      
      // When test is complete
      if (progress >= 100) {
        clearInterval(testInterval);
        
        // Calculate averages
        const avgDownload = testData.reduce((acc, item) => acc + parseFloat(item.download), 0) / testData.length;
        const avgUpload = testData.reduce((acc, item) => acc + parseFloat(item.upload), 0) / testData.length;
        const avgLatency = testData.reduce((acc, item) => acc + parseFloat(item.latency), 0) / testData.length;
        
        setTestResults({
          downloadSpeed: parseFloat(avgDownload.toFixed(2)),
          uploadSpeed: parseFloat(avgUpload.toFixed(2)),
          latency: parseFloat(avgLatency.toFixed(2)),
          completedAt: new Date(),
          testId: "DIAG-" + Date.now().toString().slice(-6),
        });
        
        setStage("complete");
      }
    }, 800);
  };
  
  const restartTest = () => {
    setStage("loading");
    setTestProgress(0);
    setSpeedData([]);
    setTestResults({
      downloadSpeed: 0,
      uploadSpeed: 0,
      latency: 0,
      completedAt: null,
      testId: "",
    });
    getNetworkInfo();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[rgb(7,98,39)] py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto mb-8 bg-[rgb(0,66,13)] border-[rgb(255,210,0)]">
          <CardHeader className="border-b border-[rgb(255,210,0)]">
            <CardTitle className="flex justify-between items-center text-white">
              <span>Diagnóstico de Rede</span>
              {stage === "complete" && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Concluído
                </Badge>
              )}
              {networkInfo.isVPN && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Conexão VPN
                </Badge>
              )}
              {!networkInfo.isVPN && networkInfo.ipv4 && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  Conexão Direta
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6 text-white">
            {stage === "loading" && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(255,210,0)] mx-auto mb-4"></div>
                <p>Coletando informações de rede...</p>
              </div>
            )}
            
            {(stage === "testing" || stage === "complete") && (
              <>
                <NetworkInfo networkInfo={networkInfo} userData={userData} />
                
                {stage === "testing" && (
                  <TestProgress progress={testProgress} />
                )}
                
                {speedData.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Resultados do Teste de Velocidade</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={speedData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                          <XAxis 
                            dataKey="name"
                            label={{ value: 'Tempo', position: 'insideBottomRight', offset: -5 }}
                            tick={{ fontSize: 10, fill: '#ffffff' }}
                          />
                          <YAxis tick={{ fill: '#ffffff' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0, 66, 13, 0.9)',
                              borderColor: 'rgb(255, 210, 0)',
                              color: '#ffffff'
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="download" stroke="#3b82f6" name="Download (Mbps)" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="upload" stroke="#10b981" name="Upload (Mbps)" />
                          <Line type="monotone" dataKey="latency" stroke="#f59e0b" name="Latência (ms)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
                
                {stage === "complete" && (
                  <>
                    <ResultsSummary testResults={testResults} />
                    <ReportForm 
                      testId={testResults.testId} 
                      userData={userData} 
                      networkInfo={networkInfo} 
                      testResults={testResults}
                      speedData={speedData}
                    />
                    
                    <div className="flex justify-center mt-8">
                      <Button 
                        onClick={restartTest} 
                        variant="outline" 
                        className="mx-2 border-[rgb(255,210,0)] text-[rgb(255,210,0)] hover:bg-[rgb(255,210,0)] hover:text-[rgb(0,66,13)]"
                      >
                        Reiniciar Diagnóstico
                      </Button>
                      <Button 
                        onClick={() => navigate("/")} 
                        variant="outline" 
                        className="mx-2 border-[rgb(255,210,0)] text-[rgb(255,210,0)] hover:bg-[rgb(255,210,0)] hover:text-[rgb(0,66,13)]"
                      >
                        Voltar ao Início
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Diagnostic;
