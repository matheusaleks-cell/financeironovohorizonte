const { PrismaClient } = require('@prisma/client')
require('dotenv').config()
const prisma = new PrismaClient()

async function main() {
    const users = [
        { name: 'Daine', username: 'daine', role: 'ADMIN' },
        { name: 'Fernando', username: 'fernando', role: 'ADMIN' },
        { name: 'Michel', username: 'michel', role: 'ADMIN' },
        { name: 'Mayara', username: 'mayara', role: 'ADMIN' },
    ]

    for (const u of users) {
        await prisma.user.upsert({
            where: { username: u.username },
            update: {},
            create: {
                name: u.name,
                username: u.username,
                password: '123', // Default password
                role: u.role,
            },
        })
    }

    const incomeCategories = [
        'Hospedagem', 'Diária', 'Extra', 'Consumo', 'Outros'
    ]

    const expenseCategories = [
        'Funcionários', 'Manutenção', 'Café da manhã', 'Limpeza',
        'Lavanderia', 'Energia elétrica', 'Água', 'Internet',
        'Compras gerais', 'Impostos', 'Outros'
    ]

    for (const name of incomeCategories) {
        await prisma.category.create({
            data: { name, type: 'INCOME' }
        })
    }

    for (const name of expenseCategories) {
        await prisma.category.create({
            data: { name, type: 'EXPENSE' }
        })
    }

    console.log('Seed completed!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
