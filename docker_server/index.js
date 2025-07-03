import './util/setupEnv.js'

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Docker from 'dockerode';

import protectedRoute from './util/protectedRoute.js';
import initDockerSession from './util/sessionSocket.js';

const docker = new Docker();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust in production
        methods: ['GET', 'POST'],
    },
});

// Attach /session namespace
const sessionNamespace = io.of('/session');
initDockerSession(sessionNamespace);

app.use(express.json());


const stopContainer = async (container) => {
    let details = await container.inspect();
    if (details.State.Status == 'running')
        await container.stop();
}
const removeContainer = async (container) => {
    let details = await container.inspect();
    if (details.State.Status == 'running')
        await container.stop();
    await container.remove();
}


app.post('/session/create', protectedRoute, async (req, res) => {
    const { userId, metadata, image } = req.body;
    const subdomain = metadata._id+'.terminal.localhost';
    const appPort = 3000;
    //was working over here
    //create container..know more about Tty...after creating return data and upadte metadata in backend and .save() it
    let container = await docker.createContainer({
        name: metadata._id,
        Image: image.image,
        Cmd: image.cmd[0],
        Tty: true,
        WorkingDir: '/guestUser',
        Labels: {
            'traefik.enable': 'true',
            [`traefik.http.routers.${metadata._id}.rule`]: `Host(\`${subdomain}\`)`,
            [`traefik.http.routers.${metadata._id}.entrypoints`]: 'http',
            [`traefik.http.services.${metadata._id}.loadbalancer.server.port`]: `${appPort}`,
        },
        ExposedPorts: {
            [`${appPort}/tcp`]: {}
        },
        HostConfig: {
            Memory: 512 * 1024 * 1024, 
            MemorySwap: 512 * 1024 * 1024,
            NanoCpus: 0.5 * 1e9,
            NetworkMode: 'traefik-net',
            PortBindings: {
                [`${appPort}/tcp`]: [{ HostPort: "" }]
            }
        }
    });
    console.log(container.id);
    return res.status(200).json({ status: "success", message: "Session Crerated!" });
})

app.delete('/session/remove/:name', protectedRoute, async (req, res) => {
    const { metadata } = req.payload;   //From JWT token
    const container = docker.getContainer(metadata._id);
    let containerData;
    try {
        containerData = await container.inspect();
        console.log(containerData);
        if (containerData)
            await removeContainer(container);

        return res.status(200).json({ status: 'success', message: 'Container Removed!' });
    } catch (err) {
        if (err.statusCode === 404) {
            console.log('No Such Container');
            return res.status(404).json({ status: 'Not-Found', message: 'No Container Found!' });
        } else {
            return res.status(500).json({ status: 'Internal Server Error', message: 'Some Internal Server Error Occured!' });
        }
    }
})

app.post('/session/resume/:name', protectedRoute, async (req, res) => {
    const { metadata } = req.payload;   //From JWT token
    const container = docker.getContainer(metadata._id);

    try {
        const info = await container.inspect();
        if (info.State.Running) {
            return res.status(409).json({ status: 'error', message: 'Container already running' });
        } else {
            await container.start();
            return res.status(200).json({ status: 'success', message: 'Session Started' });
        }
    } catch (err) {
        console.log('Error while starting the container');
        console.error(err);
        return res.status(500).json({ status: 'error', message: 'Server side error' });
    }
});

app.post('/session/pause/:name', protectedRoute, async (req, res) => {
    const { metadata } = req.payload;   //From JWT token
    const container = docker.getContainer(metadata._id);

    try {
        const info = await container.inspect();
        if (!info.State.Running) {
            return res.status(409).json({ status: 'error', message: 'Container already paused' });
        } else {
            await container.stop();
            return res.status(200).json({ status: 'success', message: 'Session Paused' });
        }
    } catch (err) {
        console.log('Error while starting the container');
        console.error(err);
        return res.status(500).json({ status: 'error', message: 'Server side error' });
    }
});


server.listen(5001, () => console.log("Docker Server Running..."));
