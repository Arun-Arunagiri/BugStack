import { connectToDatabase } from '@/lib/mongodb';
import { Bug } from '@/models/Bug';
import { Project } from '@/models/Project';
import { User } from '@/models/User';

export async function POST(req: Request) {
    try {
        const { name, description, projectId, status, testerEmail } = await req.json();
        await connectToDatabase();

        const project = await Project.findById(projectId).populate(['developer', 'tester']);
        if (!project) {
            return Response.json({ success: false, message: 'Project not found' }, { status: 404 });
        }

        const tester = await User.findOne({ email: testerEmail, role: 'tester' });
        if (!tester || tester._id.toString() !== project.tester._id.toString()) {
            return Response.json({ success: false, message: 'Tester not assigned to this project' }, { status: 403 });
        }

        const newBug = new Bug({
            name,
            description,
            status,
            project: project._id,
            developer: project.developer._id,
            tester: tester._id,
        });

        await newBug.save();

        return Response.json({ success: true, bug: newBug });
    } catch (err) {
        console.error('Error creating bug:', err);
        return Response.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
