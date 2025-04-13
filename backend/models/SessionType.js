import mongoose from 'mongoose';

const SessionTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    cmd: { type: [String], default: ['/bin/bash'] },
    createdAt: { type: Date, default: Date.now }
})

const SessionType = mongoose.model('cloudterminal_sessionType', SessionTypeSchema);

export default SessionType;