
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { startOfDay, endOfDay, eachDayOfInterval, format, parseISO } from 'date-fns';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // Default to current month if not specified
    const now = new Date();
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const startDate = startDateParam ? startOfDay(parseISO(startDateParam)) : startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
    const endDate = endDateParam ? endOfDay(parseISO(endDateParam)) : endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    // Get all transactions
    // Optimization: In a real scenario we should filter by date in the DB query
    // But since db.getTransactions() returns all, we filter in memory for now based on existing implementation style
    const allTx = await db.getTransactions();

    const transactions = allTx.filter(t => {
        const d = new Date(t.date);
        return d >= startDate && d <= endDate;
    });

    // Generate all days in interval to ensure chart continuity
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const chartData = days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayTransactions = transactions.filter(t => format(new Date(t.date), 'yyyy-MM-dd') === dateStr);

        const income = dayTransactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = dayTransactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            date: format(day, 'dd/MM'),
            fullDate: dateStr,
            income,
            expense,
            balance: income - expense
        };
    });

    return NextResponse.json(chartData);
}
