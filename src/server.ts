import express from 'express';
import cors from 'cors';
import speedTestRouter from './api/speedTest';

const app = express();

app.use(cors());
app.use(express.json());

// Adiciona os endpoints de teste de velocidade
app.use('/api', speedTestRouter);

// ... existing code ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 