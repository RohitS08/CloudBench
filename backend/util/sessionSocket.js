import { io as clientIo } from 'socket.io-client';

export default function initSessionNamespace(io) {
  io.on('connection', (socket) => {
    console.log('[Frontend Socket] Connected to /session');

    let dockerSocket;

    socket.on('start-session', ({ sessionId }) => {
      // 🔌 Connect to Docker server
      dockerSocket = clientIo('http://localhost:5001/session');

      dockerSocket.on('connect', () => {
        dockerSocket.emit('start-session', { sessionId });
      });

      // Relay Docker output -> frontend
      dockerSocket.on('output', (data) => {
        socket.emit('output', data);
      });

      dockerSocket.on('metrics', (data) => {
        socket.emit('metrics', data);
      })


      // Relay frontend input -> Docker
      socket.on('input', (data) => {
        dockerSocket.emit('input', data);
      });


      socket.on('disconnect', () => {
        dockerSocket.disconnect();
      });
    });
  });
}
