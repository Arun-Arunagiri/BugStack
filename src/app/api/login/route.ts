import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
// import User from '@/'

export async function POST(req: Request) {
    const { email, password } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ email, password });

    if (!user) {
        return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    return Response.json({
        success: true,
        user: {
            email: user.email,
            name: user.name,
            role: user.role,
        },
    });
}
