// app/api/user/profile-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';
import ConnectDB from '@/config/ConnectDB';
import { getUserIdFromSession } from '@/utils/helpers/session';

export async function PUT(req: NextRequest) {
    try {
        await ConnectDB();

        const userId = await getUserIdFromSession();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { image } = body;

        if (!image || typeof image !== 'string') {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        // Optionally: validate that the string is a proper data URL
        if (!/^data:image\/(png|jpeg|webp|avif);base64,/.test(image)) {
            return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
        }

        // Update the user's image
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image },
            { new: true } // return the updated document
        ).select('name email image role');

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ updatedImage: updatedUser.image }, { status: 200 });
    } catch (err) {
        console.error('Update image error:', err);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
