import React, { useState, useEffect } from "react";
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
    email: "",
    campus: "",
    location: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("diagnosticFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    // Salvar no localStorage
    localStorage.setItem("diagnosticFormData", JSON.stringify(newData));
  };

  const handleSelectChange = (name: string, value: string) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    // Salvar no localStorage
    localStorage.setItem("diagnosticFormData", JSON.stringify(newData));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.email || !formData.campus || !formData.location) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    // Validate email format (must end with @ufabc.edu.br)
    if (!formData.email.endsWith('@ufabc.edu.br')) {
      toast.error("Por favor, use um email institucional (@ufabc.edu.br)");
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
        <Label htmlFor="email" className="text-white">Email Institucional</Label>
        <Input 
          id="email" 
          name="email" 
          type="email"
          placeholder="seu.email@ufabc.edu.br" 
          value={formData.email} 
          onChange={handleChange}
          required
          className="bg-white/10 border-[rgb(255,210,0)] text-white placeholder:text-white/50"
        />
        <p className="text-xs text-white/70">
          Utilize seu email institucional com domínio @ufabc.edu.br
        </p>
      </div>

      <Alert className="bg-[rgb(7,98,39)] border-[rgb(255,210,0)]">
        <InfoIcon className="h-4 w-4 text-[rgb(255,210,0)]" />
        <AlertDescription className="text-sm text-white">
          Forneça informações precisas sobre sua localização. Estes dados são essenciais para que o Núcleo de Tecnologia da Informação (NTI) verifique se há algum problema isolado ou parte de uma falha generalizada na infraestrutura de rede.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="campus" className="text-white">Campus</Label>
          <Select
            value={formData.campus}
            onValueChange={(value) => handleSelectChange("campus", value)}
          >
            <SelectTrigger id="campus" className="bg-white/10 border-[rgb(255,210,0)] text-white">
              <SelectValue placeholder="Selecione o campus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="santo-andre">Santo André</SelectItem>
              <SelectItem value="sao-bernardo">São Bernardo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-white">Localização</Label>
          <Input 
            id="location" 
            name="location" 
            placeholder="Ex: Bloco A - Torre 2 - 6º - 603" 
            value={formData.location} 
            onChange={handleChange}
            required
            className="bg-white/10 border-[rgb(255,210,0)] text-white placeholder:text-white/50"
          />
          <p className="text-xs text-white/70">
            Exemplos: Bloco A - Torre 2 - 6º - 603, Bloco K, Bloco L - 5º andar - L501
          </p>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-[rgb(255,210,0)] hover:bg-[rgb(255,210,0)]/90 text-[rgb(0,66,13)] font-bold" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Iniciando..." : "Iniciar Diagnóstico"}
        </Button>
      </div>
    </form>
  );
};

export default DiagnosticForm;
