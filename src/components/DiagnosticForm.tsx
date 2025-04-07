
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";

const DiagnosticForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    campus: "",
    building: "",
    floor: "",
    room: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.fullName || !formData.campus || !formData.building || !formData.floor || !formData.room) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Store form data in session storage to use in the diagnostic page
      sessionStorage.setItem("diagnosticUserData", JSON.stringify(formData));
      
      // Navigate to the diagnostic page
      navigate("/diagnostic");
    } catch (error) {
      console.error("Error starting diagnostic:", error);
      toast.error("Ocorreu um erro ao iniciar o diagnóstico. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo</Label>
        <Input 
          id="fullName" 
          name="fullName" 
          placeholder="Digite seu nome completo" 
          value={formData.fullName} 
          onChange={handleChange}
          required
        />
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm">
          Forneça informações precisas sobre sua localização. Estes dados são essenciais para que o Núcleo de Tecnologia da Informação (NTI) verifique se há algum problema isolado ou parte de uma falha generalizada na infraestrutura de rede.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="campus">Campus</Label>
          <Select
            value={formData.campus}
            onValueChange={(value) => handleSelectChange("campus", value)}
          >
            <SelectTrigger id="campus">
              <SelectValue placeholder="Selecione o campus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="santo-andre">Santo André</SelectItem>
              <SelectItem value="sao-bernardo">São Bernardo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="building">Bloco</Label>
          <Select
            value={formData.building}
            onValueChange={(value) => handleSelectChange("building", value)}
          >
            <SelectTrigger id="building">
              <SelectValue placeholder="Selecione o bloco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Bloco A</SelectItem>
              <SelectItem value="B">Bloco B</SelectItem>
              <SelectItem value="C">Bloco C</SelectItem>
              <SelectItem value="D">Bloco D</SelectItem>
              <SelectItem value="E">Bloco E</SelectItem>
              <SelectItem value="F">Bloco F</SelectItem>
              <SelectItem value="G">Bloco G</SelectItem>
              <SelectItem value="H">Bloco H</SelectItem>
              <SelectItem value="I">Bloco I</SelectItem>
              <SelectItem value="J">Bloco J</SelectItem>
              <SelectItem value="K">Bloco K</SelectItem>
              <SelectItem value="L">Bloco L</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor">Andar</Label>
          <Select
            value={formData.floor}
            onValueChange={(value) => handleSelectChange("floor", value)}
          >
            <SelectTrigger id="floor">
              <SelectValue placeholder="Selecione o andar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Térreo">Térreo</SelectItem>
              <SelectItem value="1º Andar">1º Andar</SelectItem>
              <SelectItem value="2º Andar">2º Andar</SelectItem>
              <SelectItem value="3º Andar">3º Andar</SelectItem>
              <SelectItem value="4º Andar">4º Andar</SelectItem>
              <SelectItem value="5º Andar">5º Andar</SelectItem>
              <SelectItem value="Subsolo">Subsolo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="room">Sala</Label>
          <Input 
            id="room" 
            name="room" 
            placeholder="Digite o número da sala" 
            value={formData.room} 
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Iniciando..." : "Iniciar Diagnóstico"}
        </Button>
      </div>
    </form>
  );
};

export default DiagnosticForm;
