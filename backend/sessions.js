import express from 'express';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

import protectedRoute from './util/protectedRoute.js';

import SessionMetadata from './models/SessionMetadata.js';
import SessionTypes from './models/SessionType.js';

const router = express.Router();

router.post('/new', protectedRoute, async (req, res) => {
    console.log('New Session Created');
    const data = req.body;
    
    if(!data.session_type)
        return res.status(400).json({ status: 'error', message: 'Session Type not provided'});

    const dockerAccessToken = jwt.sign({ user_id: req.user_id, session_type: data.session_type }, process.env.DOCKER_SERVER_SHARED_SECRET);

    const { session_type } = req.body;
    const image = await SessionTypes.findOne({ name: session_type }, { _id:0, createdAt: 0 }).lean();

    if(!image) return res.status(400).json({status: 'error', message: 'Invalid Session Type, select valid Option!'});
    const metadata = new SessionMetadata({
        name : req.body.session_name,
        user_id: req.user_id,
        session_type: data.session_type,
        container_id: "Hardcodede_container_id",
        status: "created"
    })

    await fetch(`${process.env.DOCKER_SERVER_BASE_URL}/session/create`, {
        method: 'POST',
        headers:{
            'Authorization': `Bearer ${dockerAccessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: req.user_id, image, metadata })
    })
    .then(res => res.json())
    .then(async res => {
        console.log(res);
        if(res.status=='success'){
            
            await metadata.save();
        }
        console.log("Docker server accessed and successfully created session")
    })
    .catch(err => console.log("Error Creating new-session: ", err));

    res.status(200).json({ status: 'success', msg:"Created"});
})

router.post('/remove/:id', protectedRoute, async (req, res) => {
    const metadataId = req.params.id;   //Metadata Id is used as Container's Name (used for accessing it)
    const metadata = await SessionMetadata.findOne({ _id: metadataId });
    
    if(!metadata) return res.status(404).json({ status: 'Not-Found', message: 'No Such Container'});

    const dockerAccessToken = jwt.sign({ user_id: req.user_id, metadata }, process.env.DOCKER_SERVER_SHARED_SECRET);

    fetch(`${process.env.DOCKER_SERVER_BASE_URL}/session/remove/${metadataId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${dockerAccessToken}`
        }
    })
    .then(async response => {
        if(response.status===200){
            await SessionMetadata.deleteOne({ _id: metadataId });
            console.log('Container Removed Successfully');
            return res.status(200).json({ status: 'success', message: 'Container Removed Successfully'});
        }else if(response.status===404){
            return res.status(404).json({ status: 'Not-Found', message: 'No Such Container Found!'});
        }else{
            throw new Error('Error at docker Server');
        }
    })
    .catch(err => {
        console.error(err);
        console.log('Error occured while sending delete req to docker server'); 
        return res.status(500).json({ status: 'error', message: 'Interval Server Error while Removing Container'});
    })
})

router.post('/resume/:id', protectedRoute, async(req, res) => {
    const metadataId = req.params.id;   //Metadata Id is used as Container's Name (used for accessing it)
    const metadata = await SessionMetadata.findOne({ _id: metadataId });
    
    if(!metadata) return res.status(404).json({ status: 'Not-Found', message: 'No Such Container'});

    const dockerAccessToken = jwt.sign({ user_id: req.user_id, metadata }, process.env.DOCKER_SERVER_SHARED_SECRET);

    fetch(`${process.env.DOCKER_SERVER_BASE_URL}/session/resume/${metadataId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${dockerAccessToken}`
        }
    })
    .then(async response => {
        if(response.status===200){
            metadata.status = 'running';
            await metadata.save();
            return res.status(200).json({ status: 'success', message: 'Session Resumed!'});
        }else if(response.status===404){
            return res.status(404).json({ status: 'Not-Found', message: 'No Such Container Found!'});
        }else{
            throw new Error('Error at docker Server');
        }
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ status: 'error', message: 'Interval Server Error while Resuming Container'});
    })
})

router.post('/pause/:id', protectedRoute, async(req, res) => {
    const metadataId = req.params.id;   //Metadata Id is used as Container's Name (used for accessing it)
    const metadata = await SessionMetadata.findOne({ _id: metadataId });
    
    if(!metadata) return res.status(404).json({ status: 'Not-Found', message: 'No Such Container'});

    const dockerAccessToken = jwt.sign({ user_id: req.user_id, metadata }, process.env.DOCKER_SERVER_SHARED_SECRET);

    fetch(`${process.env.DOCKER_SERVER_BASE_URL}/session/pause/${metadataId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${dockerAccessToken}`
        }
    })
    .then(async response => {
        if(response.status===200){
            metadata.status = 'paused';
            await metadata.save();
            return res.status(200).json({ status: 'success', message: 'Session Paused!'});
        }else if(response.status===404){
            return res.status(404).json({ status: 'Not-Found', message: 'No Such Container Found!'});
        }else{
            throw new Error('Error at docker Server');
        }
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ status: 'error', message: 'Interval Server Error while Pausing Container'});
    })
})


router.post('/getUserSessions', protectedRoute, async(req, res) => {
    const metadatas = await SessionMetadata.find({ user_id:  req.user_id});
    res.status(200).json({ status: 'success', message: 'List of sessions', session_list: metadatas})
})

export default router;