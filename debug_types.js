
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const types = await prisma.transaction.groupBy({
            by: ['type'],
            _count: {
                type: true,
            },
        });
        console.log('TYPES:', JSON.stringify(types, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
