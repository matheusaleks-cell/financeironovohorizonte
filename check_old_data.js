const { PrismaClient } = require('@prisma/client');

const connectionString = "postgresql://postgres:lj5PboM7Xgz2cg2S@db.ysdldvtxgieqztqbitzt.supabase.co:6543/postgres?pgbouncer=true";

const prisma = new PrismaClient({
    datasources: {
        db: { url: connectionString }
    }
});

async function main() {
    try {
        const userCount = await prisma.user.count();
        const txCount = await prisma.transaction.count();
        console.log(`OLD DB STATUS: Users=${userCount}, Transactions=${txCount}`);

        if (txCount > 0) {
            const txs = await prisma.transaction.findMany({ take: 5 });
            console.log("Sample Transaction:", txs[0]);
        }
    } catch (e) {
        console.error("Failed to connect to old DB:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
