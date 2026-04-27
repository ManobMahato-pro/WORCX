const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const app = express();

// A basic route just so Render knows the app is alive
app.get('/', (req, res) => res.send('WORCX Server is running!'));

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// Start the WebSocket server
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('A new user connected!');

  // When the server receives a message from a user...
  ws.on('message', (message) => {
    
    // Broadcast it to EVERYONE ELSE who is connected
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => console.log('User disconnected'));
});
