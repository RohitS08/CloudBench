import express from 'express';
const router = express.Router();
import  jwt from 'jsonwebtoken';
import User from './models/Users.js';
import RefreshToken from './models/RefreshToken.js';
import protectedRoute from './util/protectedRoute.js';

router.post('/refresh-accessToken', protectedRoute, async (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'AccessToken Refreshed',
        accessToken: req.body.token
    });
});

router.post('/logout', protectedRoute, async (req, res) => {
    const refreshtoken = req.cookies?.refresh_token;
    if(refreshtoken){
        await RefreshToken.deleteOne({ refresh_token: refreshtoken });
        res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    }else{
        return res.status(200).json({ status: 'invalid', message: 'Already Logged out' });
    }
});

router.post('/register', async (req, res) => {
    const data = req.body;
    if(!data || !data.email || !data.password || !data.username)
        return res.status(400).json({ status: 'error', message: 'Invalid data' });

    const user = await User.findOne({email:data.email}).exec();
    if(user){
        return res.status(400).json({
            status: 'invalid',
            message: 'User already exists'
        });
    }else{
        const newUser = new User({username: data.username, email: data.email, password: data.password});
        await newUser.save();
        res.status(200).json({
            status: 'success',
            message: 'User registered successfully'
        });
    }
    
});

router.post('/login', async (req, res) => {
    const data = req.body;
    if(!data || !data.email || !data.password)
        return res.status(400).json({ status: 'error', message: 'Invalid data' });

    const user = await User.findOne({email: data.email}).exec();
    if(user && user.password === data.password){
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SECRET_EXPIRE_TIME });
        
        let refreshtoken = await RefreshToken.generateToken(user);
        refreshtoken = refreshtoken.refresh_token;

        res.cookie('refresh_token', refreshtoken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.status(200).json({ status: 'success', message: 'Login successful', accessToken:token });
    }

    return res.status(200).json({ status: 'invalid', message: 'User does not exist' });

});

export default router;