import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const subscription = await request.json();

        // Basic deduplication check could stem from DB unique constraint
        await db.saveSubscription(subscription);

        return NextResponse.json({ success: true });
    } catch (e: any) {
        // P2002 is Prisma unique constraint error
        if (e.code === 'P2002') return NextResponse.json({ success: true });

        console.error('Subscription error:', e);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
