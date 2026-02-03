const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding users...");

    try {
        // Daine (Usuário)
        await prisma.user.create({
            data: { name: 'Daine', username: 'Daine', password: '123', role: 'USER', mustChangePassword: true }
        });
        console.log("User 'Daine' created.");

        // Michel (Usuário)
        await prisma.user.create({
            data: { name: 'Michel', username: 'Michel', password: '123', role: 'USER', mustChangePassword: true }
        });
        console.log("User 'Michel' created.");

        // Mayara (Usuário)
        await prisma.user.create({
            data: { name: 'Mayara', username: 'Mayara', password: '123', role: 'USER', mustChangePassword: true }
        });
        console.log("User 'Mayara' created.");

        // Suporte (Master)
        await prisma.user.create({
            data: { name: 'Suporte Técnico', username: 'Suporte', password: '211198', role: 'SUPER_ADMIN', mustChangePassword: false }
        });
        console.log("User 'Suporte' created.");

        const categories = [
            { name: 'Diária', type: 'INCOME' },
            { name: 'Consumo', type: 'INCOME' },
            { name: 'Hospedagem', type: 'INCOME' },
            { name: 'Funcionários', type: 'EXPENSE' },
            { name: 'Manutenção', type: 'EXPENSE' },
            { name: 'Energia elétrica', type: 'EXPENSE' }
        ];

        for (const c of categories) {
            await prisma.category.create({ data: c });
        }
        console.log("Categories created.");

    } catch (e) {
        console.error("Error seeding:", e.message);
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
