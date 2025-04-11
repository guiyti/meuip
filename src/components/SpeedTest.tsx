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

  const simulateTest = async (type: "ping" | "download" | "upload") => {
    setCurrentTest(type);
    
    // Retorna um resultado aleatório imediatamente
    switch (type) {
      case "ping":
        return Math.random() * 50 + 10; // 10-60ms
      case "download":
        return Math.random() * 90 + 10; // 10-100Mbps
      case "upload":
        return Math.random() * 40 + 5; // 5-45Mbps
    }
  };

  const runTest = async () => {
    setIsRunning(true);

    try {
      const ping = await simulateTest("ping");
      const download = await simulateTest("download");
      const upload = await simulateTest("upload");

      onTestComplete({
        timestamp: Date.now(),
        download,
        upload,
        ping,
      });
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
    }
  };

  const getTestLabel = () => {
    if (!currentTest) return "";
    switch (currentTest) {
      case "ping":
        return "Testando latência...";
      case "download":
        return "Testando velocidade de download...";
      case "upload":
        return "Testando velocidade de upload...";
    }
  };

  return (
    <Card className="p-6 bg-white/10 border-[rgb(255,210,0)]">
      {isRunning ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[rgb(255,210,0)]">{getTestLabel()}</h3>
          <Progress value={100} className="h-2" />
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