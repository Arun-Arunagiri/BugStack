import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/models/Project';
import { User } from '@/models/User';
import { Types } from 'mongoose';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const testerEmail = searchParams.get("testerEmail");
    const developerEmail = searchParams.get("developerEmail");

    await connectToDatabase();

    try {
        const query: { developer?: Types.ObjectId; tester?: Types.ObjectId } = {};

        if (testerEmail) {
            const tester = await User.findOne({ email: testerEmail, role: 'tester' });
            if (!tester) {
                return Response.json({ success: false, message: "Tester not found" }, { status: 404 });
            }
            query.tester = tester._id;
        }

        if (developerEmail) {
            const developer = await User.findOne({ email: developerEmail, role: 'developer' });
            if (!developer) {
                return Response.json({ success: false, message: "Developer not found" }, { status: 404 });
            }
            query.developer = developer._id;
        }

        const projects = await Project.find(query);
        return Response.json({ success: true, projects });
    } catch (err) {
        console.error("Error fetching projects:", err);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}


// export async function GET() {
//     await connectToDatabase();

//     const projects = await Project.find({})
//         .populate('developer', 'name email')
//         .populate('tester', 'name email');

//     return Response.json(projects);
// }

export async function POST(req: Request) {
    try {
        const { name, description, status, developerEmail, testerEmail } = await req.json();
        await connectToDatabase();

        const developer = await User.findOne({ email: developerEmail, role: 'developer' });
        const tester = await User.findOne({ email: testerEmail, role: 'tester' });

        if (!developer || !tester) {
            return Response.json({ success: false, message: "Invalid developer or tester email" }, { status: 400 });
        }

        const newProject = new Project({
            name,
            description,
            status,
            developer: developer._id,
            tester: tester._id,
        });

        await newProject.save();

        return Response.json({ success: true, project: newProject });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

