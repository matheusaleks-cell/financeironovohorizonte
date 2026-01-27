const { PrismaClient } = require('@prisma/client');

// IPv4 POOLER CONNECTION STRING
// Format: postgres://[user].[project]:[pass]@[pooler_host]:6543/[db]?pgbouncer=true
// Host: aws-0-sa-east-1.pooler.supabase.com (AWS São Paulo IPv4)
const connectionString = "postgresql://postgres.rkpfxlcveftnljukeypu:DaineeFernand%C3%A3o@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const prisma = new PrismaClient({
    datasources: {
        db: { url: connectionString }
    }
});

async function main() {
    console.log("Testing IPv4 POOLED connection (aws-0-sa-east-1)...");
    try {
        const users = await prisma.user.findMany({ take: 1 });
        console.log("SUCCESS! Connected via IPv4 Pooler. Users found:", users.length);
    } catch (e) {
        console.error("CONNECTION FAILED:", e.message);
    }
}

main()
    .finally(() => prisma.$disconnect());
