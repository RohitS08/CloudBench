import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';

const generateFromRefreshToken = async (refreshtoken) => {
    try{
        if(!refreshtoken) return null;
        if(refreshtoken.expiresAt < Date.now()){    //Delete the refresh token if its expired
            await RefreshToken.deleteOne({ id: refreshtoken.refresh_token });
            return null;
        }

        let newAccessToken = jwt.sign({ id: refreshtoken.user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SECRET_EXPIRE_TIME });
        return newAccessToken;
    }catch(err){
        console.log("Error while Re-Generating AccessToken : ", err);
        return null;
    }
}

export default async (req, res, next) => {
    let token = req.body.token;
    let refreshtoken = req.cookies?.refresh_token
        ? await RefreshToken.findOne({ refresh_token: req.cookies?.refresh_token })
        : null;

    if(!token && !refreshtoken){   //No Access-Token and No Refresh-Token
        return res.status(401).json({ status: 'Unauthorized', message: 'Not Logged-In'});
    }

    if(!token && refreshtoken){     //No Access-Token but has Refresh-Token
        let accessToken = await generateFromRefreshToken(refreshtoken);

        if(!accessToken){
            res.clearCookie('refresh_token',  { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return res.status(401).json({ status: 'Unauthorized', message: 'Refresh-Token Expired'});
        }

        req.body.token = accessToken;
        token = accessToken;
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if(err) {
            console.log(err);
            if (err.name == "TokenExpiredError") { //Access-Token Expired, Re-Generate using Refresh-token
                console.log("verify->exp");
                let accessToken = await generateFromRefreshToken(refreshtoken);

                if (!accessToken) {
                    res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                    return res.status(401).json({ status: 'Unauthorized', message: 'Refresh-Token Expired' });
                }

                req.user_id = refreshtoken.user_id;
                req.body.token = accessToken;
                return next();
            } else if (err) {
                console.log("Error while verifying token: ", err);
                return res.status(401).json({ status: 'unauthorized', message: 'Invalid Token, Log-In' });
            }
        }else{
            req.user_id = decoded.id;
            return next();
        }
    });
}