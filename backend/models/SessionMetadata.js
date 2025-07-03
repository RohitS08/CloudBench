import mongoose from 'mongoose';
import SessionType from './SessionType.js';

const SessionMetadataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CloudTerminal_User', required: true },
    session_type: {
        type: String, require: true, validate: {
            validator: async function (value) {
                const exists = await SessionType.exists({ name: value });
                return !!exists;
            },
            message: props => `'${props.value}' is not a valid session type`
        }
    },

    container_id: { type: String, require: true },
    status: { type: String, enum: ['created', 'running', 'paused', 'stopped', 'terminated', 'error'], default: 'created' },

    createdAt: { type: Date, default: Date.now },
    lastOpened: { type: Date, default: null },
});

const SessionMetadata = mongoose.model('CloudTerminal_SessionMetatda', SessionMetadataSchema);

export default SessionMetadata;