
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const expenseCategories = [
            'Funcionários', 'Manutenção', 'Café da manhã', 'Limpeza',
            'Lavanderia', 'Energia elétrica', 'Água', 'Internet',
            'Compras gerais', 'Impostos', 'Outros'
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
