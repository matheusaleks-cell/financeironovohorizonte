const { PrismaClient } = require('@prisma/client');

// Credentials
const user = "postgres.rkpfxlcveftnljukeypu";
const pass = "DaineeFernand%C3%A3o";
const port = "6543";
const dbName = "postgres";

const regions = [
    "aws-0-sa-east-1.pooler.supabase.com", // Brazil
    "aws-0-us-east-1.pooler.supabase.com", // US East N. Virginia
    "aws-0-us-west-1.pooler.supabase.com", // US West N. California
    "aws-0-eu-central-1.pooler.supabase.com", // EU Frankfurt
    "aws-0-eu-west-1.pooler.supabase.com", // EU Ireland
    "aws-0-eu-west-2.pooler.supabase.com", // EU London
    "aws-0-ap-southeast-1.pooler.supabase.com", // Singapore
    "aws-0-ap-northeast-1.pooler.supabase.com", // Tokyo
    "aws-0-ap-south-1.pooler.supabase.com", // Mumbai
    "aws-0-ca-central-1.pooler.supabase.com" // Canada
];

async function testRegion(host) {
    const connStr = `postgresql://${user}:${pass}@${host}:${port}/${dbName}?pgbouncer=true&connect_timeout=5`;
    const prisma = new PrismaClient({
        datasources: { db: { url: connStr } },
        log: []
    });

    console.log(`Testing Region: ${host}...`);
    try {
        await prisma.user.findMany({ take: 1 });
        console.log(`[SUCCESS] Found correct region: ${host}`);
        return true;
    } catch (e) {
        if (e.message.includes("Tenant or user not found")) {
            console.log(`[FAILED] Tenant not found in ${host}`);
        } else {
            console.log(`[ERROR] ${host}: ${e.message.split('\n')[0]}`); // Print first line of error
        }
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    for (const host of regions) {
        if (await testRegion(host)) break;
    }
}

main();
