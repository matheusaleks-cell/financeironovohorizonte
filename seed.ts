import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.user.count();
    if (count > 0) {
        console.log("Database already seeded.");
        return;
    }

    console.log("Seeding users...");
    await prisma.user.create({ data: { name: 'Daine', username: 'daine', password: '123', role: 'ADMIN' } });
    await prisma.user.create({ data: { name: 'Suporte', username: 'Suporte', password: '211198', role: 'SUPER_ADMIN' } });

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
}

main().catch(console.error).finally(() => prisma.$disconnect());
