const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Verificando usuário 'Suporte'...");

    // Buscar por username exato (case insensitive)
    const users = await prisma.user.findMany({
        where: {
            username: {
                mode: 'insensitive',
                equals: 'Suporte'
            }
        }
    });

    if (users.length === 0) {
        console.log("❌ Usuário 'Suporte' NÃO ENCONTRADO no banco.");
    } else {
        users.forEach(u => {
            console.log(`✅ Encontrado: ID=${u.id}, User='${u.username}', Pass='${u.password}', Role='${u.role}'`);

            // Simular check do login
            const inputPass = '211198';
            if (u.password === inputPass) {
                console.log("   🔑 Senha CORRETA para input '211198'.");
            } else {
                console.log(`   ⛔ Senha INCORRETA. Esperado: '${u.password}', Recebido: '${inputPass}'`);
            }
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
