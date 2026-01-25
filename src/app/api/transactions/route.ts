import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const status = searchParams.get('status');

    let transactions = await db.getTransactions();

    if (type) {
        transactions = transactions.filter(t => t.type === type);
    }

    if (month && year) {
        transactions = transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() + 1 === parseInt(month) && d.getFullYear() === parseInt(year);
        });
    }

    if (status) {
        transactions = transactions.filter(t => t.status === status);
    }

    return NextResponse.json(transactions);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Attempt add (will throw if month locked)
        const newTx = await db.addTransaction({
            ...body,
            status: body.status || 'COMPLETED' // Default to COMPLETED if not sent
        });

        await db.logAction({
            action: 'CREATE',
            entity: 'Transaction',
            entityId: String(newTx.id),
            details: `Created ${newTx.type} (Status: ${newTx.status}) - R$ ${newTx.amount}`,
            userId: body.userId
        });

        return NextResponse.json(newTx);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
