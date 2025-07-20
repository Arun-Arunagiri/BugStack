import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(req: Request) {
    try {
        const { email, password, name, role } = await req.json();

        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return Response.json({ success: false, message: 'User already exists' }, { status: 400 });
        }

        const newUser = new User({ email, password, name, role });
        await newUser.save();

        return Response.json({ success: true, user: { email, name, role } });
    } catch (error) {
        console.error('User creation failed:', error);
        return Response.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
