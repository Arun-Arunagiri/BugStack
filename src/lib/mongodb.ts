import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI as string, {
            dbName: 'nextjsapplication',
        });


        isConnected = true;
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
    }
}
