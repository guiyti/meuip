// This file simulates the backend Flask API
import { toast } from "@/components/ui/use-toast";
import speedTest from 'speedtest-cli';

// Network connection types
export type ConnectionType = 'Direct' | 'VPN';
export interface NetworkInfo {
  ipv4: string;
  ipv6: string | null;
  localIpv4: string | null;
  localIpv6: string | null;
  connectionType: ConnectionType;
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  latency: number | null;
  timestamp: string | null;
}

export type SpeedTestResult = {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  timestamp: string;
};

export type SpeedTestProgress = {
  phase: 'download' | 'upload' | 'latency' | 'complete';
  progress: number; // 0-100
  currentValue: number;
  unit: string;
  downloadSeries: number[];
  uploadSeries: number[];
  latencySeries: number[];
};

// Simulate obtaining the connection information
export const getNetworkInfo = async (): Promise<NetworkInfo> => {
  try {
    // Obter endereços IP reais
    const response = await fetch('https://api.ipify.org?format=json');
    const ipv4Data = await response.json();
    const ipv4 = ipv4Data.ip;

    // Tentar obter IPv6
    let ipv6 = null;
    try {
      const ipv6Response = await fetch('https://api6.ipify.org?format=json');
      const ipv6Data = await ipv6Response.json();
      ipv6 = ipv6Data.ip;
    } catch (error) {
      console.log('IPv6 não disponível');
    }

    // Obter IPs locais
    let localIpv4 = null;
    let localIpv6 = null;
    try {
      const localIpResponse = await fetch('/api/local-ip');
      const localIpData = await localIpResponse.json();
      localIpv4 = localIpData.ipv4;
      localIpv6 = localIpData.ipv6;
    } catch (error) {
      console.log('Não foi possível obter IPs locais:', error);
    }

    // Verificar se é VPN (simplificado)
    const isVPN = ipv4.startsWith('10.') || 
                 (ipv4.startsWith('172.') && parseInt(ipv4.split('.')[1]) >= 16 && parseInt(ipv4.split('.')[1]) <= 31) || 
                 ipv4.startsWith('192.168.');

    return {
      ipv4,
      ipv6,
      localIpv4,
      localIpv6,
      connectionType: isVPN ? 'VPN' : 'Direct',
      downloadSpeed: null,
      uploadSpeed: null,
      latency: null,
      timestamp: null,
    };
  } catch (error) {
    console.error('Error fetching network info:', error);
    toast({
      title: "Erro",
      description: "Não foi possível obter informações de rede. Por favor, tente novamente.",
      variant: "destructive"
    });
    throw error;
  }
};

// Real speed test using local endpoints
export const runSpeedTest = async (
  location: string, 
  updateProgress: (progress: SpeedTestProgress) => void
): Promise<SpeedTestResult> => {
  try {
    const downloadSeries: number[] = [];
    const uploadSeries: number[] = [];
    const latencySeries: number[] = [];

    // Teste de latência
    updateProgress({
      phase: 'latency',
      progress: 0,
      currentValue: 0,
      unit: 'ms',
      downloadSeries: Array(10).fill(0),
      uploadSeries: Array(10).fill(0),
      latencySeries: Array(10).fill(0)
    });

    // Medir latência usando endpoint local
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();
      await fetch('/api/ping', { 
        cache: 'no-store',
        method: 'GET'
      });
      const endTime = performance.now();
      const latency = endTime - startTime;
      latencySeries[i] = latency;
      
      updateProgress({
        phase: 'latency',
        progress: ((i + 1) / 10) * 100,
        currentValue: latency,
        unit: 'ms',
        downloadSeries: Array(10).fill(0),
        uploadSeries: Array(10).fill(0),
        latencySeries: [...latencySeries]
      });

      // Adiciona um delay de 500ms entre os testes
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Teste de download
    updateProgress({
      phase: 'download',
      progress: 0,
      currentValue: 0,
      unit: 'Mbps',
      downloadSeries: Array(10).fill(0),
      uploadSeries: Array(10).fill(0),
      latencySeries: [...latencySeries]
    });

    // Medir velocidade de download usando endpoint local
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();
      const response = await fetch('/api/download', { 
        cache: 'no-store',
        method: 'GET'
      });
      const blob = await response.blob();
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // em segundos
      const size = blob.size / (1024 * 1024); // em MB
      const speed = (size * 8) / duration; // em Mbps
      downloadSeries[i] = speed;
      
      updateProgress({
        phase: 'download',
        progress: ((i + 1) / 10) * 100,
        currentValue: speed,
        unit: 'Mbps',
        downloadSeries: [...downloadSeries],
        uploadSeries: Array(10).fill(0),
        latencySeries: [...latencySeries]
      });

      // Adiciona um delay de 1 segundo entre os testes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Teste de upload
    updateProgress({
      phase: 'upload',
      progress: 0,
      currentValue: 0,
      unit: 'Mbps',
      downloadSeries: [...downloadSeries],
      uploadSeries: Array(10).fill(0),
      latencySeries: [...latencySeries]
    });

    // Medir velocidade de upload usando endpoint local
    for (let i = 0; i < 10; i++) {
      const data = new Blob([new ArrayBuffer(10 * 1024 * 1024)]); // 10MB
      const startTime = performance.now();
      await fetch('/api/upload', {
        method: 'POST',
        body: data,
        cache: 'no-store'
      });
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // em segundos
      const size = 10 * 8; // em Mbps
      const speed = size / duration; // em Mbps
      uploadSeries[i] = speed;
      
      updateProgress({
        phase: 'upload',
        progress: ((i + 1) / 10) * 100,
        currentValue: speed,
        unit: 'Mbps',
        downloadSeries: [...downloadSeries],
        uploadSeries: [...uploadSeries],
        latencySeries: [...latencySeries]
      });

      // Adiciona um delay de 1 segundo entre os testes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Calcular médias
    const avgDownloadSpeed = downloadSeries.reduce((sum, val) => sum + val, 0) / downloadSeries.length;
    const avgUploadSpeed = uploadSeries.reduce((sum, val) => sum + val, 0) / uploadSeries.length;
    const avgLatency = latencySeries.reduce((sum, val) => sum + val, 0) / latencySeries.length;

    // Marcar teste como completo
    updateProgress({
      phase: 'complete',
      progress: 100,
      currentValue: 0,
      unit: '',
      downloadSeries: [...downloadSeries],
      uploadSeries: [...uploadSeries],
      latencySeries: [...latencySeries]
    });

    return {
      downloadSpeed: parseFloat(avgDownloadSpeed.toFixed(2)),
      uploadSpeed: parseFloat(avgUploadSpeed.toFixed(2)),
      latency: parseFloat(avgLatency.toFixed(2)),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error running speed test:', error);
    toast({
      title: "Erro no teste",
      description: "Ocorreu um erro durante o teste de velocidade. Por favor, tente novamente.",
      variant: "destructive"
    });
    throw error;
  }
};
