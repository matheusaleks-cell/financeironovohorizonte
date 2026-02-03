const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Verificando TODOS os usuários...");

    const users = await prisma.user.findMany();

    if (users.length === 0) {
        console.log("❌ NENHUM USUÁRIO ENCONTRADO no banco.");
    } else {
        console.log(`✅ Encontrados ${users.length} usuários:\n`);
        users.forEach(u => {
            console.log(`[ID: ${u.id}] User: '${u.username}' | Role: '${u.role}' | Pass: '${u.password}'`);
        });
    }

    // Verificar especificamente os solicitados
    const expected = ['Daine', 'Michel', 'Mayara', 'Suporte'];
    console.log("\n--- Checagem Específica ---");

    for (const name of expected) {
        const found = users.find(u => u.username.toLowerCase() === name.toLowerCase());
        if (found) {
            console.log(`✅ ${name}: OK (Pass: ${found.password})`);
        } else {
            console.log(`❌ ${name}: NÃO ENCONTRADO!`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
