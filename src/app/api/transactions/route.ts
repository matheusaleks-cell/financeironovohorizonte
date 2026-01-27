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

        // Validation
        if (!body.amount || !body.categoryId || !body.date) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
        }

        // Check lock
        if (await db.isMonthLocked(body.date)) {
            return NextResponse.json({ error: 'Mês fechado. Não é possível adicionar lançamentos.' }, { status: 400 });
        }

        const transaction = await db.addTransaction({
            type: body.type,
            amount: body.amount,
            categoryId: body.categoryId,
            date: new Date(body.date),
            description: body.description || '',
            userId: body.userId,
            paymentMethod: body.paymentMethod || 'Outros',
            proofUrl: body.proofUrl,
            status: body.status || 'COMPLETED'
        });

        // Notify on Expense
        if (body.type === 'EXPENSE') {
            await sendPushNotification(
                'Nova Despesa Registrada 💸',
                `R$ ${body.amount} - ${body.description}`,
                '/despesas'
            );
        }

        return NextResponse.json(transaction);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
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
