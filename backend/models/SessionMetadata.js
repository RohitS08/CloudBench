import mongoose from 'mongoose';

const SessionMetadataSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CloudTerminal_User', required: true },
    session_type: { type: String, enum: ['Python, NodeJs', 'Linux'], require: true },

    container_id: { type: String, require: true },
    status: { type: String, enum: ['running', 'paused', 'terminated'], default: 'running' },

    createdAt: { type: Date, default: Date.now },
    lastOpened: { type: Date, default: Date.now },
});

const SessionMetadata = mongoose.model('CloudTerminal_SessionMetatda', SessionMetadataSchema);

export default SesssionMetatdata;