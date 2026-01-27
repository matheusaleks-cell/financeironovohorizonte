import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ExcelJS from 'exceljs';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const isFull = searchParams.get('full') === 'true';
    const month = parseInt(searchParams.get('month') || '0');
    const year = parseInt(searchParams.get('year') || '0');

    let transactions = await db.getTransactions();

    // Filter if not full report
    if (!isFull && month && year) {
        transactions = transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() + 1 === month && d.getFullYear() === year;
        });
    }

    // Create Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Pousada System';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Transações');

    // Define Columns
    sheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Data', key: 'date', width: 15 },
        { header: 'Tipo', key: 'type', width: 10 },
        { header: 'Categoria', key: 'category', width: 20 },
        { header: 'Descrição', key: 'description', width: 30 },
        { header: 'Entrada (R$)', key: 'income', width: 15 },
        { header: 'Saída (R$)', key: 'expense', width: 15 },
        { header: 'Método Pagamento', key: 'method', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
    ];

    // Style Header
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }; // Dark blue slate

    // Add Rows
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        const isIncome = t.type === 'INCOME';
        const val = t.amount;
        if (isIncome) totalIncome += val; else totalExpense += val;

        const row = sheet.addRow({
            id: t.id,
            date: new Date(t.date),
            type: isIncome ? 'Receita' : 'Despesa',
            category: t.category?.name || '-',
            description: t.description,
            income: isIncome ? val : null,
            expense: isIncome ? null : val,
            method: t.paymentMethod,
            status: t.status === 'COMPLETED' ? 'Confirmado' : 'Pendente'
        });

        // Coloring
        if (t.status === 'PENDING') {
            row.getCell('status').font = { color: { argb: 'FFFF0000' } }; // Red text for pending
        }
    });

    // Formatting columns
    sheet.getColumn('income').numFmt = '"R$"#,##0.00';
    sheet.getColumn('expense').numFmt = '"R$"#,##0.00';
    sheet.getColumn('date').numFmt = 'dd/mm/yyyy';

    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Resumo');
    summarySheet.columns = [{ header: 'Item', key: 'item', width: 20 }, { header: 'Valor', key: 'value', width: 20 }];

    summarySheet.addRow({ item: 'Total Receitas', value: totalIncome });
    summarySheet.addRow({ item: 'Total Despesas', value: totalExpense });
    summarySheet.addRow({ item: 'Saldo Líquido', value: totalIncome - totalExpense });

    summarySheet.getColumn('value').numFmt = '"R$"#,##0.00';
    summarySheet.getRow(1).font = { bold: true };

    // Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="relatorio-${isFull ? 'completo' : `${month}-${year}`}.xlsx"`
        }
    });
}
