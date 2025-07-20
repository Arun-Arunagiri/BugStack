// /api/bugs/[id]/route.ts
import { connectToDatabase } from "@/lib/mongodb";
import { Bug } from "@/models/Bug";
import { NextRequest } from "next/server";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    await connectToDatabase();
    try {
        await Bug.findByIdAndDelete(params.id);
        return Response.json({ success: true });
    } catch (err) {
        return Response.json({ success: false, message: "Failed to delete bug" }, { status: 500 });
    }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await connectToDatabase();
    const { status } = await req.json();

    try {
        const updatedBug = await Bug.findByIdAndUpdate(params.id, { status }, { new: true });
        return Response.json({ success: true, bug: updatedBug });
    } catch (err) {
        return Response.json({ success: false, message: "Failed to update status" }, { status: 500 });
    }
}
