
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

const Diagnostic = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [stage, setStage] = useState("loading");
  const [networkInfo, setNetworkInfo] = useState({
    ipv4: "",
    ipv6: "",
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
    // Load user data from session storage
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
      // In a real implementation, we would use an actual service to get IP addresses
      // Simulating API call to get IP addresses
      setTimeout(() => {
        setNetworkInfo({
          ipv4: "192.168.1." + Math.floor(Math.random() * 255),
          ipv6: "2001:0db8:85a3:0000:0000:8a2e:0370:733" + Math.floor(Math.random() * 10),
        });
        setStage("testing");
        startSpeedTest();
      }, 1500);
    } catch (error) {
      console.error("Error getting network info:", error);
      toast.error("Erro ao obter informações de rede");
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader className="border-b">
            <CardTitle className="flex justify-between items-center">
              <span>Diagnóstico de Rede</span>
              {stage === "complete" && (
                <span className="text-sm font-normal bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Concluído
                </span>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6">
            {stage === "loading" && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name"
                            label={{ value: 'Tempo', position: 'insideBottomRight', offset: -5 }}
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip />
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
                        className="mx-2"
                      >
                        Reiniciar Diagnóstico
                      </Button>
                      <Button 
                        onClick={() => navigate("/")} 
                        variant="outline" 
                        className="mx-2"
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
