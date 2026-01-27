const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Removing category "Diária"...');

        const deleted = await prisma.category.deleteMany({
            where: {
                name: 'Diária',
                type: 'INCOME'
            }
        });

        console.log(`Deleted ${deleted.count} categories.`);
    } catch (e) {
        console.error('Error removing category:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
