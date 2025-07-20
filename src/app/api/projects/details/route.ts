import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { Bug } from "@/models/Bug";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
        return Response.json({ success: false, message: "Project name required" }, { status: 400 });
    }

    await connectToDatabase();

    try {
        const project = await Project.findOne({ name }).populate("developer tester", "name email");
        if (!project) {
            return Response.json({ success: false, message: "Project not found" }, { status: 404 });
        }

        const bugs = await Bug.find({ project: project._id });

        return Response.json({ success: true, project, bugs });
    } catch (error) {
        console.error("Error fetching project details:", error);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
