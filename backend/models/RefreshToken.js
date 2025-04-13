import mongoose from 'mongoose';
import crypto from 'crypto';

const RefreshTokenSchema = new mongoose.Schema({
    refresh_token: { type: String, unique: true, required: true},
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CloudTerminal_User', required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true } 
});

RefreshTokenSchema.statics.generateToken = async function (user){
    let token;
    let exists = true;

    while(exists){
        token = crypto.randomBytes(16).toString('hex');
        exists = await this.exists({ refresh_token: token });
    }

    let expiresAt = Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRE_TIME || '86400000'); //Defaults to 1 Day

    return new this({refresh_token: token, user_id: user._id, expiresAt }).save();
}

const RefreshToken = mongoose.model('CloudTerminal_RefreshToken', RefreshTokenSchema);

export default RefreshToken;