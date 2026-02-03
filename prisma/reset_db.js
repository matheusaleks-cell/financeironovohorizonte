const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { execSync } = require('child_process');

async function main() {
    console.log("⚠️  INICIANDO RESET TOTAL DO BANCO DE DADOS...");

    try {
        console.log("🗑️  Deletando Auditorias...");
        try { await prisma.auditLog.deleteMany({}); } catch (e) { console.error("Falha em AuditLog:", e.message); }

        console.log("🗑️  Deletando Transações...");
        try { await prisma.transaction.deleteMany({}); } catch (e) { console.error("Falha em Transaction:", e.message); }

        console.log("🗑️  Deletando Fechamentos Mensais...");
        try { await prisma.monthlyClosing.deleteMany({}); } catch (e) { console.error("Falha em MonthlyClosing:", e.message); }

        console.log("🗑️  Deletando Assinaturas Push...");
        try { await prisma.pushSubscription.deleteMany({}); } catch (e) { console.error("Falha em PushSubscription:", e.message); }

        console.log("🗑️  Deletando Categorias...");
        try { await prisma.category.deleteMany({}); } catch (e) { console.error("Falha em Category:", e.message); }

        console.log("🗑️  Deletando Usuários...");
        try { await prisma.user.deleteMany({}); } catch (e) { console.error("Falha em User:", e.message); }

        console.log("✅ Banco de dados limpo com sucesso! (Erros ignorados se houver)");

        // 2. Rodar o seed para restaurar dados padrão
        console.log("\n🌱 Restaurando dados padrão (admin/categorias)...");
        try {
            execSync('node force_seed.js', { stdio: 'inherit', cwd: __dirname });
            console.log("✅ Reset concluído! O sistema está zerado e pronto para uso.");
        } catch (e) {
            console.error("❌ Erro ao rodar force_seed.js:", e.message);
        }

    } catch (e) {
        console.error("❌ Erro fatal desconhecido:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
