
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

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

  const saveTestResults = async () => {
    try {
      const { error } = await supabase.from('network_tests').insert({
        email: userData.email,
        campus: userData.campus,
        building: userData.building,
        floor: userData.floor,
        room: userData.room,
        ipv4: networkInfo.ipv4,
        ipv6: networkInfo.ipv6,
        download_speed: testResults.downloadSpeed,
        upload_speed: testResults.uploadSpeed,
        latency: testResults.latency,
        test_id: testId,
        ticket_number: ticketNumber || null,
        notes: notes || null,
        speed_data: speedData,
      });

      if (error) throw error;
      toast.success("Os resultados do teste foram salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar resultados:", error);
      toast.error("Erro ao salvar os resultados. Tente novamente.");
    }
  };

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
      if (ticketNumber || notes) {
        doc.setFontSize(16);
        doc.text("Informações do Chamado", 20, 134);
        
        doc.setFontSize(12);
        if (ticketNumber) {
          doc.text(`Número do Chamado: ${ticketNumber}`, 20, 142);
        }
        
        if (notes) {
          const splitNotes = doc.splitTextToSize(notes, 170);
          doc.text("Observações:", 20, ticketNumber ? 150 : 142);
          doc.text(splitNotes, 20, ticketNumber ? 158 : 150);
        }
      }
      
      // Salvar o PDF
      doc.save(`diagnostico-rede-${testId}.pdf`);
      
      toast.success("Relatório PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o relatório PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    setIsGenerating(true);

    try {
      // Primeiro, salvar os resultados no banco de dados
      await saveTestResults();
      
      // Depois, gerar o PDF
      generatePDF();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
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
