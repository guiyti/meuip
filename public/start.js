
// This file helps start the application
const { exec } = require('child_process');
const path = require('path');

console.log('Iniciando o servidor UFABC - Teste de Desempenho da Rede...');

const serverProcess = exec('node ../server.js', {
    cwd: path.join(__dirname, '..')
});

serverProcess.stdout.on('data', (data) => {
    console.log(data);
});

serverProcess.stderr.on('data', (data) => {
    console.error(data);
});

console.log('Para acessar a aplicação, abra o navegador e acesse:');
console.log('http://localhost:3000');
