import express from 'express';
import cors from 'cors';
import speedTestRouter from './api/speedTest';
import { getIPInfo } from './services/ipService';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Adiciona os endpoints de teste de velocidade
app.use('/api', speedTestRouter);

app.get('/api/ip', async (req, res) => {
  try {
    const ipInfo = await getIPInfo();
    res.json(ipInfo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter informações do IP' });
  }
});

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});

// Endpoint para teste de download
app.get('/api/download-test', (req, res) => {
  // Criar um arquivo de teste de 1MB
  const fileSize = 1024 * 1024; // 1MB
  const data = Buffer.alloc(fileSize);
  for (let i = 0; i < fileSize; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }
  
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', fileSize);
  res.send(data);
});

// Endpoint para teste de upload
app.post('/api/upload-test', (req, res) => {
  // O arquivo é recebido automaticamente pelo express
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 