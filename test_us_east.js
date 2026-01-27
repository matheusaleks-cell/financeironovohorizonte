const { PrismaClient } = require('@prisma/client');

// US EAST 1
const host = "aws-0-us-east-1.pooler.supabase.com";
const user = "postgres.rkpfxlcveftnljukeypu";
const pass = "DaineeFernand%C3%A3o";
const port = "6543";

const connStr = `postgresql://${user}:${pass}@${host}:${port}/postgres?pgbouncer=true&connect_timeout=5`;

const prisma = new PrismaClient({
    datasources: { db: { url: connStr } }
});

async function main() {
    console.log(`Testing US EAST: ${host}...`);
    try {
        await prisma.user.findMany({ take: 1 });
        console.log(`[SUCCESS] Connected to US EAST!`);
    } catch (e) {
        console.log(`[FAILED] ${e.message}`);
    } finally {
        await prisma.$disconnect();
    }
}

main();
