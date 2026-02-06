
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const expenseCategories = [
            'Funcionários', 'Manutenção', 'Energia elétrica', // Existing
            'Água', 'Internet', 'Café da manhã',
            'Limpeza (Produtos de limpeza)', 'Lavanderia',
            'Compras gerais', 'Impostos',
            'Marketing / Publicidade', 'Sistemas / Software',
            'Retiradas / Pró-labore', 'Passagem de funcionário',
            'Outros'
        ];

        console.log("Checking and adding missing expense categories...");

        for (const name of expenseCategories) {
            const existing = await prisma.category.findFirst({
                where: { name, type: 'EXPENSE' }
            });

            if (!existing) {
                await prisma.category.create({
                    data: { name, type: 'EXPENSE' }
                });
                console.log(`[ADDED] ${name}`);
            } else {
                console.log(`[EXISTS] ${name}`);
            }
        }

        // Also check Income categories just in case
        const incomeCategories = [
            'Hospedagem', 'Extra', 'Consumo', 'Outros'
        ];

        for (const name of incomeCategories) {
            const existing = await prisma.category.findFirst({
                where: { name, type: 'INCOME' }
            });

            if (!existing) {
                await prisma.category.create({
                    data: { name, type: 'INCOME' }
                });
                console.log(`[ADDED] ${name}`);
            } else {
                console.log(`[EXISTS] ${name}`);
            }
        }

        console.log("Category check completed.");

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
