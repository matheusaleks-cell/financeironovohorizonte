const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: { username: 'Suporte' }
    });
    console.log("User found:", user ? user.username : 'NOT FOUND');
    console.log("Password stored:", user ? user.password : 'N/A');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
