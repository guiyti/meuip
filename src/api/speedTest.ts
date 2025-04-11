import express from 'express';
import { Router } from 'express';
import crypto from 'crypto';

const router = Router();

// Endpoint para teste de ping
router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

// Endpoint para teste de download
router.get('/download', (req, res) => {
  const bufferSize = 100 * 1024 * 1024; // 100MB
  const buffer = crypto.randomBytes(bufferSize);
  
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', bufferSize);
  res.send(buffer);
});

// Endpoint para teste de upload
router.post('/upload', (req, res) => {
  req.on('data', () => {
    // Apenas consumindo os dados recebidos
  });

  req.on('end', () => {
    res.status(200).json({ message: 'OK' });
  });
});

export default router; 