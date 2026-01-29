
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const totalTransactions = await prisma.transaction.count();
        const expenseTransactions = await prisma.transaction.count({
            where: { type: 'EXPENSE' }
        });
        const activeExpenseTransactions = await prisma.transaction.count({
            where: { type: 'EXPENSE', deletedAt: null }
        });

        console.log(`Total Transactions: ${totalTransactions}`);
        console.log(`Total Expenses: ${expenseTransactions}`);
        console.log(`Active Expenses (not deleted): ${activeExpenseTransactions}`);

        const types = await prisma.transaction.groupBy({
            by: ['type'],
            _count: {
                type: true,
            },
        });
        console.log('\nTransaction Types Distribution:', types);

        const firstFew = await prisma.transaction.findMany({
            take: 5
        });
        console.log('\nSample transactions:', firstFew);


    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
