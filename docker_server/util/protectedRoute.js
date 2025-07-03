import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader)
        return res.status(401).json({ status: 'error', message: 'Missing token' });

    const token = authHeader.split(' ')[1];
    
    try{
        let verified = jwt.verify(token, process.env.BACKEND_SHARED_SECRET);
        req.payload = verified;
        next();
    }catch(err){
        console.log("Error while verifying JWT token", err, err.name);
        return res.status(401).json({ status: 'unauthorized', message: 'Unauthorized Request to create a session'})
    }
}