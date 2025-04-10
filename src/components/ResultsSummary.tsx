import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Clock } from "lucide-react";

interface ResultsSummaryProps {
  testResults: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    completedAt: Date | null;
    testId: string;
  };
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ testResults }) => {
  const getRating = (type: string, value: number) => {
    switch (type) {
      case 'download':
        if (value >= 50) return { status: 'Excelente', color: 'text-green-400' };
        if (value >= 30) return { status: 'Bom', color: 'text-blue-400' };
        if (value >= 10) return { status: 'Aceitável', color: 'text-yellow-400' };
        return { status: 'Baixo', color: 'text-red-400' };
      case 'upload':
        if (value >= 30) return { status: 'Excelente', color: 'text-green-400' };
        if (value >= 15) return { status: 'Bom', color: 'text-blue-400' };
        if (value >= 5) return { status: 'Aceitável', color: 'text-yellow-400' };
        return { status: 'Baixo', color: 'text-red-400' };
      case 'latency':
        if (value < 10) return { status: 'Excelente', color: 'text-green-400' };
        if (value < 20) return { status: 'Bom', color: 'text-blue-400' };
        if (value < 40) return { status: 'Aceitável', color: 'text-yellow-400' };
        return { status: 'Alto', color: 'text-red-400' };
      default:
        return { status: 'N/A', color: 'text-slate-400' };
    }
  };

  const downloadRating = getRating('download', testResults.downloadSpeed);
  const uploadRating = getRating('upload', testResults.uploadSpeed);
  const latencyRating = getRating('latency', testResults.latency);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 text-white">Resumo dos Resultados</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[rgb(0,66,13)] border-[rgb(255,210,0)]">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <ArrowDown className="h-5 w-5 mr-2 text-[rgb(255,210,0)]" />
              <h4 className="font-medium text-white">Download</h4>
            </div>
            <p className="text-2xl font-bold text-white">{testResults.downloadSpeed} Mbps</p>
            <p className={`text-sm mt-1 ${downloadRating.color}`}>
              {downloadRating.status}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[rgb(0,66,13)] border-[rgb(255,210,0)]">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <ArrowUp className="h-5 w-5 mr-2 text-[rgb(255,210,0)]" />
              <h4 className="font-medium text-white">Upload</h4>
            </div>
            <p className="text-2xl font-bold text-white">{testResults.uploadSpeed} Mbps</p>
            <p className={`text-sm mt-1 ${uploadRating.color}`}>
              {uploadRating.status}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[rgb(0,66,13)] border-[rgb(255,210,0)]">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 mr-2 text-[rgb(255,210,0)]" />
              <h4 className="font-medium text-white">Latência</h4>
            </div>
            <p className="text-2xl font-bold text-white">{testResults.latency} ms</p>
            <p className={`text-sm mt-1 ${latencyRating.color}`}>
              {latencyRating.status}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="bg-[rgb(0,66,13)] border-[rgb(255,210,0)]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:justify-between text-sm">
              <div className="mb-2 md:mb-0">
                <span className="text-[rgb(255,210,0)]">ID do Diagnóstico:</span>{" "}
                <span className="font-medium text-white">{testResults.testId}</span>
              </div>
              <div>
                <span className="text-[rgb(255,210,0)]">Data/Hora:</span>{" "}
                <span className="font-medium text-white">
                  {testResults.completedAt?.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsSummary;
