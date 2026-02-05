const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { username: true, password: true, role: true }
    });
    console.log("--- CREDENTIALS ---");
    users.forEach(u => {
        console.log(`User: ${u.username} | Pass: ${u.password} | Role: ${u.role}`);
    });
    console.log("-------------------");

    const closings = await prisma.monthlyClosing.findMany();
    console.log("--- CLOSED MONTHS ---");
    console.log(closings);
    console.log("---------------------");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
