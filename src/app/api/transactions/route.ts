import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendPushNotification } from '@/lib/push';

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

        // Fire and forget push
        try {
            const title = newTx.type === 'INCOME' ? '💰 Nova Receita' : '💸 Nova Despesa';
            const msg = `${newTx.description} - R$ ${newTx.amount.toFixed(2)}`;
            await sendPushNotification(title, msg, '/');
        } catch (e) {
            console.error('Push failed', e);
        }

        return NextResponse.json(newTx);

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const reason = searchParams.get('reason');
        // Ideally we get userId from session, but for now we'll accept it from params or cookie wrapper
        // Use a header or param for userId if not using server auth session
        const userId = searchParams.get('userId');

        if (!id || !reason) return NextResponse.json({ error: 'ID e Justificativa são obrigatórios' }, { status: 400 });

        // Fallback: try to extract userId from headers/cookie if not in params (simple check)
        // For this architecture, let's assume client sends it explicitly for now or default to 1 (admin) if missing to avoid breaking
        const uid = userId ? parseInt(userId) : 1;

        await db.deleteTransaction(parseInt(id), uid, reason);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
