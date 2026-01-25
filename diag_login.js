const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const usernameInput = "Suporte"; // Simulate user input
    const passwordInput = "211198";

    console.log(`Checking login for: ${usernameInput}`);

    const users = await prisma.user.findMany();

    const user = users.find(u =>
        u.username.toLowerCase().trim() === usernameInput.toLowerCase().trim() &&
        u.password === passwordInput
    );

    if (user) {
        console.log("LOGIN SUCCESS!", user);
    } else {
        console.log("LOGIN FAILED.");
        console.log("Available users:", users.map(u => `${u.username} (${u.password})`));
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
