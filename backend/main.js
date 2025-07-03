import './util/setupEnv.js'; // Ensure environment variables are loaded

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import Docker from 'dockerode';

import './util/db.js'; // Import DB Connection
import './models/Users.js';

import apiRoutes from './api.js';
import sessionRoutes from './sessions.js';
import protectedRoute from './util/protectedRoute.js';

process.env.NODE_ENV = process.env.NODE_ENV || "development";

import SessionType from './models/SessionType.js';

import initSessionNamespace from './util/sessionSocket.js';

//############################################
//#####One-time adding of Session-Types#######
//############################################
// await SessionType.insertMany([
//   {
//     name: 'Linux Shell (Alpine)',
//     image: 'alpine:latest',
//     cmd: ['/bin/sh'],
//   },
//   {
//     name: 'Node.js (Alpine)',
//     image: 'node:18-alpine',
//     cmd: ['node'],
//   },
//   {
//     name: 'Python (Alpine)',
//     image: 'python:3.11-alpine',
//     cmd: ['python3'],
//   }
// ]);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  }
});

const sessionNamespace = io.of('/session');
initSessionNamespace(sessionNamespace);

const docker = Docker();

const __dirname = dirname(fileURLToPath(import.meta.url));  //D:\Projects\cloud_cmd\backend

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);
app.use('/sessions', sessionRoutes);

app.get('/terminal', protectedRoute, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Authorized',
    token: req.body.token
  })
});
io.on('connection', async (socket) => {
  
  console.log('New connection');

  async function createContainer() {
    try {
      const container = await docker.createContainer({
        Image: 'alpine',
        Cmd: ['sh'],
        Tty: true,
        OpenStdin: true,
      });

      await container.start();
      console.log(`Container ${container.id} started for user`);
      return container;
    } catch (err) {
      console.error('Error creating container:', err);
    }
  }

  // const container = await createContainer();
  
  // console.log(`Container ${container.id} started for user`);

  // Handle command execution on 'msg' event
  socket.on('msg', async (cmd, callback) => {
    console.log(`Executing command: ${cmd}`);

    // Run the command inside the container
    const exec = await container.exec({
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['/bin/sh', '-c', cmd], // Execute command
    });

    exec.start((err, stream) => {
      if (err) return console.error(err);

      let output = '';
      stream.on('data', (chunk) => {
        output += chunk.toString();
      });

      stream.on('end', () => {
        console.log(`Command output: ${output}`);
        callback({
          status: 'ok',
          op : output
        }) // Send output back to the client
      });
    });
  });

  // Cleanup: Stop & remove container when user disconnects
  socket.on('disconnect', async () => {
    console.log('User disconnected. Stopping container...');
    await container.stop();
    await container.remove();
    console.log('Container removed');
  });
});
app.get('/', (req, res) => {
  res.send('Server is ready'+join(__dirname, "rohit.js"));
}); 

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});