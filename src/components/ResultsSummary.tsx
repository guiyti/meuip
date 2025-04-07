
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Wifi, ArrowUp, ArrowDown, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  // Function to determine rating based on speeds and latency
  const getRating = (type: string, value: number) => {
    switch (type) {
      case 'download':
        if (value >= 50) return { status: 'Excelente', color: 'text-green-600' };
        if (value >= 30) return { status: 'Bom', color: 'text-blue-600' };
        if (value >= 10) return { status: 'Aceitável', color: 'text-yellow-600' };
        return { status: 'Baixo', color: 'text-red-600' };
      case 'upload':
        if (value >= 30) return { status: 'Excelente', color: 'text-green-600' };
        if (value >= 15) return { status: 'Bom', color: 'text-blue-600' };
        if (value >= 5) return { status: 'Aceitável', color: 'text-yellow-600' };
        return { status: 'Baixo', color: 'text-red-600' };
      case 'latency':
        if (value < 10) return { status: 'Excelente', color: 'text-green-600' };
        if (value < 20) return { status: 'Bom', color: 'text-blue-600' };
        if (value < 40) return { status: 'Aceitável', color: 'text-yellow-600' };
        return { status: 'Alto', color: 'text-red-600' };
      default:
        return { status: 'N/A', color: 'text-slate-600' };
    }
  };

  const downloadRating = getRating('download', testResults.downloadSpeed);
  const uploadRating = getRating('upload', testResults.uploadSpeed);
  const latencyRating = getRating('latency', testResults.latency);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Resumo dos Resultados</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <ArrowDown className="h-5 w-5 mr-2 text-blue-600" />
              <h4 className="font-medium">Download</h4>
            </div>
            <p className="text-2xl font-bold">{testResults.downloadSpeed} Mbps</p>
            <p className={`text-sm mt-1 ${downloadRating.color}`}>
              {downloadRating.status}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <ArrowUp className="h-5 w-5 mr-2 text-green-600" />
              <h4 className="font-medium">Upload</h4>
            </div>
            <p className="text-2xl font-bold">{testResults.uploadSpeed} Mbps</p>
            <p className={`text-sm mt-1 ${uploadRating.color}`}>
              {uploadRating.status}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 mr-2 text-amber-600" />
              <h4 className="font-medium">Latência</h4>
            </div>
            <p className="text-2xl font-bold">{testResults.latency} ms</p>
            <p className={`text-sm mt-1 ${latencyRating.color}`}>
              {latencyRating.status}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:justify-between text-sm">
              <div className="mb-2 md:mb-0">
                <span className="text-slate-500">ID do Diagnóstico:</span>{" "}
                <span className="font-medium">{testResults.testId}</span>
              </div>
              <div>
                <span className="text-slate-500">Data/Hora:</span>{" "}
                <span className="font-medium">
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
