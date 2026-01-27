import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Fetch last 10 logs
        const logs = await db.getLogs();
        const recent = logs.reverse().slice(0, 10);

        return NextResponse.json(recent);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
