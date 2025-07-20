// /api/projects/delete.ts
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
        return Response.json({ success: false, message: "Missing project name" }, { status: 400 });
    }

    await connectToDatabase();

    try {
        await Project.deleteOne({ name });
        return Response.json({ success: true });
    } catch (err) {
        return Response.json({ success: false, message: "Failed to delete project" }, { status: 500 });
    }
}
