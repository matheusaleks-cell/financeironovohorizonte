
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const categories = await prisma.category.findMany({
            where: { deletedAt: null },
            orderBy: [{ type: 'asc' }, { name: 'asc' }]
        });
        
        console.log('--- ACTIVE CATEGORIES ---');
        categories.forEach(c => {
            console.log(`[${c.type}] ${c.name} (ID: ${c.id})`);
        });
        
        const deleted = await prisma.category.findMany({
            where: { NOT: { deletedAt: null } }
        });
        
        if (deleted.length > 0) {
            console.log('\n--- DELETED CATEGORIES ---');
            deleted.forEach(c => {
                console.log(`[${c.type}] ${c.name} (ID: ${c.id})`);
            });
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
