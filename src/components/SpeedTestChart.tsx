import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpeedTestChartProps {
  downloadSeries: number[];
  uploadSeries: number[];
  latencySeries: number[];
}

export function SpeedTestChart({ downloadSeries, uploadSeries, latencySeries }: SpeedTestChartProps) {
  // Transformar os dados para o formato esperado pelo Recharts
  const data = downloadSeries.map((_, index) => ({
    name: `${index + 1}`,
    download: downloadSeries[index],
    upload: uploadSeries[index],
    latency: latencySeries[index]
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resultado do Teste de Velocidade</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                label={{ value: 'Mbps', angle: -90, position: 'insideLeft' }}
                domain={[0, 'auto']}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'ms', angle: 90, position: 'insideRight' }}
                domain={[0, 'auto']}
              />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="download" 
                stroke="#8884d8" 
                name="Download (Mbps)" 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="upload" 
                stroke="#82ca9d" 
                name="Upload (Mbps)" 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="latency" 
                stroke="#ff7300" 
                name="Latência (ms)" 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 