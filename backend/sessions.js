import express from 'express';
import jwt from 'jsonwebtoken';
import protectedRoute from './util/protectedRoute.js';

const router = express.Router();

router.post('/new', protectedRoute, async (req, res) => {
    console.log('New Session Created');
    const data = req.body;
    
    if(!data.session_type)
        return res.status(400).json({ status: 'error', message: 'Session Type not provided'});

    const dockerAccessToken = jwt.sign({ user_id: req.user_id, session_type: data.session_type }, process.env.DOCKER_SERVER_SHARED_SECRET);
    await fetch(`${process.env.DOCKER_SERVER_BASE_URL}/session/create`, {
        method: 'POST',
        headers:{
            'Authorization': `Bearer ${dockerAccessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: req.user_id, session_type: data.session_type })
    })
    .then(res => res.json())
    .then(res => {
        console.log("Docker server accessed and successfully created session")
    })
    .catch(err => console.log("Error Creating new-session: ", err));

    res.status(200).json({ status: 'success', msg:"Created"});
})
export default router;