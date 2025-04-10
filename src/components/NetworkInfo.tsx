import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

interface NetworkInfoProps {
  networkInfo: {
    ipv4: string;
    ipv6: string;
    isVPN: boolean;
  };
  userData: {
    email: string;
    campus: string;
    building: string;
    floor: string;
    room: string;
  };
}

const NetworkInfo: React.FC<NetworkInfoProps> = ({ networkInfo, userData }) => {
  const formatCampus = (campus: string) => {
    if (campus === "santo-andre") return "Santo André";
    if (campus === "sao-bernardo") return "São Bernardo";
    return campus;
  };

  const formatIP = (ip: string) => {
    if (!ip) return "Não detectado";
    return ip;
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 text-white">Informações do Diagnóstico</h3>
      <Card className="bg-[rgb(0,66,13)] border-[rgb(255,210,0)]">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-[rgb(255,210,0)] mb-1">Usuário</h4>
              <p className="font-medium text-white">{userData.email}</p>
              
              <h4 className="text-sm font-medium text-[rgb(255,210,0)] mb-1 mt-3">Localização</h4>
              <p className="font-medium text-white">
                Campus {formatCampus(userData.campus)}, Bloco {userData.building}, {userData.floor}, Sala {userData.room}
              </p>
            </div>
            
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-[rgb(255,210,0)] mb-1">Endereço IPv4</h4>
                <div className="flex items-center gap-2">
                  <p className="font-medium font-mono text-white">{formatIP(networkInfo.ipv4)}</p>
                  <InfoIcon className="h-4 w-4 text-[rgb(255,210,0)]" title="Endereço IPv4 público da sua conexão" />
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-[rgb(255,210,0)] mb-1">Endereço IPv6</h4>
                <div className="flex items-center gap-2">
                  <p className="font-medium font-mono text-white">{formatIP(networkInfo.ipv6)}</p>
                  <InfoIcon className="h-4 w-4 text-[rgb(255,210,0)]" title="Endereço IPv6 público da sua conexão" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-[rgb(255,210,0)] mb-1">Status da Conexão</h4>
                <div className="flex items-center gap-2">
                  {networkInfo.isVPN ? (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Conexão VPN
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Conexão Direta
                    </Badge>
                  )}
                  <InfoIcon className="h-4 w-4 text-[rgb(255,210,0)]" title={networkInfo.isVPN ? "Sua conexão está passando por um serviço de VPN" : "Sua conexão está direta com a internet"} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkInfo;
