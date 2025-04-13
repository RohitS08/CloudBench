import './util/setupEnv.js'

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

app.post('/session/create', (req, res) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader)
        return res.status(401).json({ status: 'error', message: 'Missing token' });

    const token = authHeader.split(' ')[1];
    
    try{
        let verified = jwt.verify(token, process.env.BACKEND_SHARED_SECRET);
        
        if(verified){
            console.log(req.body);
        }
    }catch(err){
        console.log("Error while verifying token", err);
        res.status(400).json({ status: 'error', message: 'Unkown Error while verifying token'})
    }

    return res.status(200).json({status: "succuess", message: "Session Crerated!"});
})

server.listen(5001, () => console.log("Docker Server Running..."));
