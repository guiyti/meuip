
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface NetworkInfoProps {
  networkInfo: {
    ipv4: string;
    ipv6: string;
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

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Informações do Diagnóstico</h3>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-1">Usuário</h4>
              <p className="font-medium">{userData.email}</p>
              
              <h4 className="text-sm font-medium text-slate-500 mb-1 mt-3">Localização</h4>
              <p className="font-medium">
                Campus {formatCampus(userData.campus)}, Bloco {userData.building}, {userData.floor}, Sala {userData.room}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-1">Endereço IPv4</h4>
              <p className="font-medium font-mono">{networkInfo.ipv4}</p>
              
              <h4 className="text-sm font-medium text-slate-500 mb-1 mt-3">Endereço IPv6</h4>
              <p className="font-medium font-mono text-sm break-all">{networkInfo.ipv6}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkInfo;
