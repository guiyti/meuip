const WebSocket = require('ws');
const { exec } = require('child_process');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    ws.on('message', message => {
        const host = message.toString();
        exec(`ping -c 5 ${host}`, (error, stdout, stderr) => {
            if (error) {
                ws.send(`Conectividade com ${host}: Falhou`);
                return;
            }
            if (stdout.includes('0 received')) {
                ws.send(`Conectividade com ${host}: Falhou`);
            } else {
                ws.send(`Conectividade com ${host}: OK`);
            }
        });
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
