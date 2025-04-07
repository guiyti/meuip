
import React from "react";
import { Card } from "@/components/ui/card";
import { Toaster } from "sonner";
import DiagnosticForm from "@/components/DiagnosticForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Diagnóstico de Conexão de Rede</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Sistema de análise da infraestrutura de rede corporativa
          </p>
        </header>
        
        <Card className="max-w-3xl mx-auto p-6 shadow-lg">
          <DiagnosticForm />
        </Card>
        
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} - Núcleo de Tecnologia da Informação (NTI)</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
