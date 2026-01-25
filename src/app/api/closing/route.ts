import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    const body = await request.json();
    const { month, year } = body;

    try {
        await db.closeMonth(month, year, body);

        await db.logAction({
            action: 'UPDATE',
            entity: 'MonthlyClosing',
            entityId: `${month}/${year}`,
            details: `Month Closed - Profit: ${body.netProfit}`,
            userId: 1
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
