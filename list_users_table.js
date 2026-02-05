const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            username: true,
            role: true,
            // don't select password
        }
    });
    console.table(users);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
