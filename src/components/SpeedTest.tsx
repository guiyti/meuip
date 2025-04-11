import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TestResult {
  timestamp: number;
  download: number;
  upload: number;
  ping: number;
}

interface SpeedTestProps {
  onTestComplete: (result: TestResult) => void;
}

const SpeedTest = ({ onTestComplete }: SpeedTestProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<"ping" | "download" | "upload" | null>(null);
  const [progress, setProgress] = useState(0);

  const getPing = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch('/api/ping');
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      console.error('Erro no teste de ping:', error);
      return 0;
    }
  };

  const getDownloadSpeed = async () => {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/download-test');
      const blob = await response.blob();
      const endTime = Date.now();
      
      const durationInSeconds = (endTime - startTime) / 1000;
      const fileSizeInBytes = blob.size;
      const speedInMbps = (fileSizeInBytes * 8) / (durationInSeconds * 1000000);
      
      return speedInMbps;
    } catch (error) {
      console.error('Erro no teste de download:', error);
      return 0;
    }
  };

  const getUploadSpeed = async () => {
    try {
      // Criar um arquivo de teste de 1MB
      const fileSize = 1024 * 1024; // 1MB
      const data = new Uint8Array(fileSize);
      for (let i = 0; i < fileSize; i++) {
        data[i] = Math.floor(Math.random() * 256);
      }
      const blob = new Blob([data]);

      const startTime = Date.now();
      const formData = new FormData();
      formData.append('file', blob, 'test.bin');
      
      await fetch('/api/upload-test', {
        method: 'POST',
        body: formData
      });
      
      const endTime = Date.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedInMbps = (fileSize * 8) / (durationInSeconds * 1000000);
      
      return speedInMbps;
    } catch (error) {
      console.error('Erro no teste de upload:', error);
      return 0;
    }
  };

  const runTest = async () => {
    setIsRunning(true);
    setProgress(0);

    try {
      // Teste de Ping
      setCurrentTest("ping");
      const ping = await getPing();
      setProgress(33);

      // Testes de Download e Upload em paralelo
      setCurrentTest("download");
      const [download, upload] = await Promise.all([
        getDownloadSpeed(),
        getUploadSpeed()
      ]);
      setProgress(100);

      onTestComplete({
        timestamp: Date.now(),
        download: Number(download.toFixed(2)),
        upload: Number(upload.toFixed(2)),
        ping,
      });
    } catch (error) {
      console.error('Erro durante os testes:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
      setProgress(0);
    }
  };

  const getTestLabel = () => {
    if (!currentTest) return "";
    switch (currentTest) {
      case "ping":
        return "Testando latência...";
      case "download":
        return "Testando velocidade de download e upload...";
    }
  };

  return (
    <Card className="p-6 bg-white/10 border-[rgb(255,210,0)]">
      {isRunning ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[rgb(255,210,0)]">{getTestLabel()}</h3>
          <Progress value={progress} className="h-2" />
        </div>
      ) : (
        <Button
          onClick={runTest}
          className="w-full bg-[rgb(255,210,0)] text-black hover:bg-[rgb(255,210,0)]/90"
        >
          Iniciar Teste de Velocidade
        </Button>
      )}
    </Card>
  );
};

export default SpeedTest; 