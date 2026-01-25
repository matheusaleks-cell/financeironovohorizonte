import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    const transactions = (await db.getTransactions()); // Already sorted desc in db.ts
    const logs = (await db.getLogs());

    // CSV Generation
    const headers = ['ID', 'Data', 'Tipo', 'Categoria', 'Descricao', 'Valor', 'Status', 'Metodo', 'Responsavel'];
    const rows = transactions.map(t => [
        t.id,
        new Date(t.date).toLocaleDateString('pt-BR'),
        t.type === 'INCOME' ? 'Receita' : 'Despesa',
        t.categoryId,
        t.description,
        t.amount.toString().replace('.', ','),
        t.status === 'PENDING' ? 'Pendente' : 'Pago',
        t.paymentMethod,
        'Daine'
    ]);

    const csvContent = [
        headers.join(';'),
        ...rows.map(r => r.join(';'))
    ].join('\n');

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="relatorio-pousada-${new Date().toISOString().split('T')[0]}.csv"`
        }
    });
}
