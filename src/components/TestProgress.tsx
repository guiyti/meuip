import React from "react";
import { Progress } from "@/components/ui/progress";

interface TestProgressProps {
  progress: number;
}

const TestProgress: React.FC<TestProgressProps> = ({ progress }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-white">Teste em Andamento</h3>
        <span className="text-sm text-[rgb(255,210,0)]">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-[rgb(0,66,13)]" />
      <p className="mt-2 text-sm text-[rgb(255,210,0)]">
        {progress < 30 && "Iniciando medições..."}
        {progress >= 30 && progress < 60 && "Testando velocidade de download..."}
        {progress >= 60 && progress < 90 && "Testando velocidade de upload..."}
        {progress >= 90 && "Medindo latência..."}
      </p>
    </div>
  );
};

export default TestProgress;
