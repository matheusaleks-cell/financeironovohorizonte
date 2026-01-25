const { PrismaClient } = require('@prisma/client');

// Using the POOLED connection string (Port 6543)
const connectionString = "postgresql://postgres:lj5PboM7Xgz2cg2S@db.ysdldvtxgieqztqbitzt.supabase.co:6543/postgres?pgbouncer=true";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: connectionString
        }
    }
});

async function main() {
    console.log("Testing connection to Port 6543...");
    try {
        const users = await prisma.user.findMany({ take: 1 });
        console.log("SUCCESS! Connected and found users:", users.length);
    } catch (e) {
        console.error("CONNECTION FAILED:", e.message);
    }
}

main()
    .finally(() => prisma.$disconnect());
