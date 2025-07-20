import mongoose from 'mongoose';

const BugSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Fixed', 'Closed'],
        default: 'Open'
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Bug = mongoose.models.Bug || mongoose.model('Bug', BugSchema);
