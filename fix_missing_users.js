const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔧 Corrigindo/Criando usuários...");

    const usersToFix = [
        { name: 'Daine', username: 'Daine', password: '123', role: 'USER', mustChangePassword: true },
        { name: 'Michel', username: 'Michel', password: '123', role: 'USER', mustChangePassword: true },
        { name: 'Mayara', username: 'Mayara', password: '123', role: 'USER', mustChangePassword: true },
        { name: 'Suporte Técnico', username: 'Suporte', password: '211198', role: 'SUPER_ADMIN', mustChangePassword: false }
    ];

    for (const u of usersToFix) {
        try {
            await prisma.user.upsert({
                where: { username: u.username },
                update: {
                    name: u.name,
                    password: u.password,
                    role: u.role,
                    mustChangePassword: u.mustChangePassword,
                    deletedAt: null // Ensure not soft-deleted
                },
                create: {
                    name: u.name,
                    username: u.username,
                    password: u.password,
                    role: u.role,
                    mustChangePassword: u.mustChangePassword
                }
            });
            console.log(`✅ Usuário '${u.username}' garantido com sucesso!`);
        } catch (e) {
            console.error(`❌ Erro ao processar '${u.username}':`, e.message);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
