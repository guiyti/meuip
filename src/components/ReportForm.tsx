import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FileText, Download } from "lucide-react";

interface ReportFormProps {
  testId: string;
  userData: any;
  networkInfo: any;
  testResults: any;
  speedData: any[];
}

const ReportForm: React.FC<ReportFormProps> = ({ 
  testId, 
  userData, 
  networkInfo, 
  testResults,
  speedData 
}) => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = () => {
    setIsGenerating(true);

    // In a real implementation, we would use a library like jsPDF or pdfmake
    // to generate the PDF with all the information
    
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Relatório PDF gerado com sucesso!");
      
      // Here we would trigger the actual PDF download
      console.log("Exporting PDF with data:", {
        testId,
        userData,
        networkInfo,
        testResults,
        speedData,
        ticketNumber,
        notes
      });
    }, 2000);
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-medium mb-4">Informações do Chamado</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="ticketNumber">Número do Chamado (Opcional)</Label>
          <div className="flex items-center mt-1">
            <span className="bg-slate-100 px-3 py-2 rounded-l-md border border-r-0 border-slate-300 text-slate-500">
              #
            </span>
            <Input
              id="ticketNumber"
              placeholder="Digite o código do chamado aberto em servicos.ufabc.edu.br"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Se já abriu um chamado relacionado a este problema, informe o código para referência.
          </p>
        </div>
        
        <div>
          <Label htmlFor="notes">Observações Adicionais (Opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Descreva qualquer detalhe adicional sobre o problema de rede..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>
        
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium mb-1">Exportar Relatório Completo</h4>
                <p className="text-sm text-slate-500">
                  Gere um PDF com todos os dados do diagnóstico para compartilhar com o NTI.
                </p>
              </div>
              <Button 
                onClick={handleExportPDF} 
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <span className="flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Gerando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportForm;
