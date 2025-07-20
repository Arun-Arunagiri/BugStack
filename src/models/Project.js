import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['In Progress', 'Completed', 'On Hold'], default: 'In Progress' },
    developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
