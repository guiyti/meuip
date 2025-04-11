
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SpeedTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTest: (location: string) => void;
}

const SpeedTestModal: React.FC<SpeedTestModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartTest 
}) => {
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartTest(location);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-diagnostic-green-medium">Iniciar Diagnóstico de Rede</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location">Descreva sua localização para um diagnóstico mais eficaz</Label>
              <Input
                id="location"
                placeholder="Insira sua localização"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Exemplos: <br />
                "Bloco A - Torre 2 - 6º - 603" <br />
                "Bloco K" <br />
                "Bloco L - 5º andar - L501"
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-diagnostic-green-medium hover:bg-diagnostic-green-dark text-white"
            >
              Iniciar Teste
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpeedTestModal;
