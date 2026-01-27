const { PrismaClient } = require('@prisma/client');

// NEW DB, Port 5432 (Direct), NO pgbouncer param
const connectionString = "postgresql://postgres:DaineeFernand%C3%A3o@db.rkpfxlcveftnljukeypu.supabase.co:5432/postgres";

const prisma = new PrismaClient({
    datasources: {
        db: { url: connectionString }
    }
});

async function main() {
    console.log("Testing DIRECT connection to Port 5432...");
    try {
        const users = await prisma.user.findMany({ take: 1 });
        console.log("SUCCESS! Connected directly via 5432. Users found:", users.length);
    } catch (e) {
        console.error("CONNECTION FAILED (5432):", e.message);
    }
}

main()
    .finally(() => prisma.$disconnect());
