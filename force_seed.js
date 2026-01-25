const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding users...");

    try {
        await prisma.user.create({
            data: { name: 'Daine', username: 'daine', password: '123', role: 'ADMIN' }
        });
        console.log("User 'Daine' created.");

        await prisma.user.create({
            data: { name: 'Suporte Técnico', username: 'Suporte', password: '211198', role: 'SUPER_ADMIN' }
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
