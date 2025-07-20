import { connectToDatabase } from '@/lib/mongodb';
import { Project } from '@/models/Project';

export async function PUT(req: Request) {
    try {
        const { name, status } = await req.json();

        if (!name || !status) {
            return Response.json(
                { success: false, message: "Project name and status are required." },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const updatedProject = await Project.findOneAndUpdate(
            { name },
            { status },
            { new: true }
        );

        if (!updatedProject) {
            return Response.json(
                { success: false, message: "Project not found." },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: "Project status updated successfully.",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Error updating project status:", error);
        return Response.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
