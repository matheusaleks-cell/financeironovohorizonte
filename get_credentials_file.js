const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    const users = await prisma.user.findMany({
        select: { username: true, password: true, role: true }
    });
    let output = "--- CREDENTIALS ---\n";
    users.forEach(u => {
        output += `User: ${u.username} | Pass: ${u.password} | Role: ${u.role}\n`;
    });
    output += "-------------------\n";

    fs.writeFileSync('credentials_dump.txt', output);
    console.log("Done writing credentials.");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
