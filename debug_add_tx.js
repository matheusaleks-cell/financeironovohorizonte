const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany();
    console.log("Categories count:", categories.length);
    if (categories.length > 0) {
        console.log("First category:", categories[0]);
    } else {
        console.log("NO CATEGORIES FOUND!");
    }

    // Try to add a test transaction if user 'Michel' exists
    const michel = await prisma.user.findFirst({ where: { username: 'Michel' } });
    if (michel && categories.length > 0) {
        try {
            const tx = await prisma.transaction.create({
                data: {
                    type: 'EXPENSE',
                    amount: 10.50,
                    date: new Date(),
                    description: 'Test Transaction Script',
                    paymentMethod: 'PIX',
                    status: 'COMPLETED',
                    userId: michel.id,
                    categoryId: categories[0].id
                }
            });
            console.log("Transaction created successfully:", tx.id);
            // clean up
            await prisma.transaction.delete({ where: { id: tx.id } });
            console.log("Transaction deleted (cleanup).");
        } catch (e) {
            console.error("Failed to create transaction:", e);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
