import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);

    try {
      // Criar novo documento PDF
      const doc = new jsPDF();
      
      // Título do relatório
      doc.setFontSize(20);
      doc.text("Relatório de Diagnóstico de Rede UFABC", 20, 20);
      
      // ID do diagnóstico e data
      doc.setFontSize(12);
      doc.text(`ID do Diagnóstico: ${testId}`, 20, 30);
      doc.text(`Data/Hora: ${testResults.completedAt?.toLocaleString('pt-BR')}`, 20, 37);
      
      // Informações do usuário
      doc.setFontSize(16);
      doc.text("Informações do Usuário", 20, 47);
      
      doc.setFontSize(12);
      doc.text(`Email: ${userData.email}`, 20, 55);
      
      const formatCampus = (campus: string) => {
        if (campus === "santo-andre") return "Santo André";
        if (campus === "sao-bernardo") return "São Bernardo";
        return campus;
      };
      
      doc.text(`Localização: Campus ${formatCampus(userData.campus)}, Bloco ${userData.building}, ${userData.floor}, Sala ${userData.room}`, 20, 63);
      
      // Informações de rede
      doc.setFontSize(16);
      doc.text("Informações de Rede", 20, 73);
      
      doc.setFontSize(12);
      doc.text(`Endereço IPv4: ${networkInfo.ipv4}`, 20, 81);
      doc.text(`Endereço IPv6: ${networkInfo.ipv6}`, 20, 89);
      
      // Resultados do teste
      doc.setFontSize(16);
      doc.text("Resultados do Teste", 20, 100);
      
      doc.setFontSize(12);
      doc.text(`Download: ${testResults.downloadSpeed} Mbps`, 20, 108);
      doc.text(`Upload: ${testResults.uploadSpeed} Mbps`, 20, 116);
      doc.text(`Latência: ${testResults.latency} ms`, 20, 124);
      
      // Informações do chamado
      if (ticketNumber) {
        doc.setFontSize(16);
        doc.text("Informações do Chamado", 20, 134);
        
        doc.setFontSize(12);
        doc.text(`Número do Chamado: ${ticketNumber}`, 20, 142);
      }
      
      // Salvar o PDF
      doc.save(`diagnostico-rede-${testId}.pdf`);
      
      toast.success("Relatório PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o relatório PDF.");
    } finally {
      setIsGenerating(false);
      setDialogOpen(false);
    }
  };

  return (
    <div className="mt-8 border-t border-[rgb(255,210,0)] pt-6">
      <h3 className="text-lg font-medium mb-4 text-white">Informações do Chamado</h3>
      
      <Card className="bg-[rgb(0,66,13)] border-[rgb(255,210,0)]">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium mb-1 text-white">Exportar Relatório Completo</h4>
              <p className="text-sm text-[rgb(255,210,0)]">
                Gere um PDF com todos os dados do diagnóstico para compartilhar com o NTI.
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[rgb(255,210,0)] hover:bg-[rgb(255,210,0)]/90 text-[rgb(0,66,13)] font-bold"
                >
                  <span className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Exportar PDF
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[rgb(0,66,13)] border-[rgb(255,210,0)]">
                <DialogHeader>
                  <DialogTitle className="text-white">Número do Chamado</DialogTitle>
                  <DialogDescription className="text-[rgb(255,210,0)]">
                    Digite o número do chamado aberto em servicos.ufabc.edu.br para incluir no relatório.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center">
                    <Label htmlFor="ticketNumber" className="w-24 text-white">Chamado #</Label>
                    <div className="flex items-center flex-1">
                      <span className="bg-[rgb(0,66,13)] px-3 py-2 rounded-l-md border border-r-0 border-[rgb(255,210,0)] text-[rgb(255,210,0)]">
                        #
                      </span>
                      <Input
                        id="ticketNumber"
                        placeholder="Digite o código do chamado"
                        value={ticketNumber}
                        onChange={(e) => setTicketNumber(e.target.value)}
                        className="rounded-l-none bg-[rgb(0,66,13)] border-[rgb(255,210,0)] text-white placeholder:text-[rgb(255,210,0)]/50"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={generatePDF} 
                    disabled={isGenerating}
                    className="bg-[rgb(255,210,0)] hover:bg-[rgb(255,210,0)]/90 text-[rgb(0,66,13)] font-bold"
                  >
                    {isGenerating ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[rgb(0,66,13)] mr-2"></span>
                        Gerando...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Gerar PDF
                      </span>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportForm;
