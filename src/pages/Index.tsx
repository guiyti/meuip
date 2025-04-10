import React from "react";
import { Card } from "@/components/ui/card";
import { Toaster } from "sonner";
import DiagnosticForm from "@/components/DiagnosticForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[rgb(7,98,39)]">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Ufabc_logo.png" 
              alt="Logo UFABC" 
              className="h-16"
            />
            <h1 className="text-3xl font-bold text-white">Diagnóstico de Conexão de Rede</h1>
          </div>
          <p className="text-white/90 max-w-2xl mx-auto">
            Sistema de análise da infraestrutura de rede corporativa
          </p>
        </header>
        
        <Card className="max-w-3xl mx-auto p-6 shadow-lg bg-[rgb(0,66,13)] border-[rgb(255,210,0)]">
          <DiagnosticForm />
        </Card>
        
        <footer className="mt-12 text-center text-sm text-white/80">
          <p>© {new Date().getFullYear()} - Núcleo de Tecnologia da Informação (NTI)</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
