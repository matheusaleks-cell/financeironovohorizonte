const dns = require('dns');
const { promisify } = require('util');
const resolve4 = promisify(dns.resolve4);

const projectRef = 'rkpfxlcveftnljukeypu';
const domains = [
    `db.${projectRef}.supabase.co`,
    `${projectRef}.pooler.supabase.com`,
    `aws-0-sa-east-1.pooler.supabase.com` // Common fallback, but requires verification
];

async function check() {
    console.log("Checking IPv4 (A Records) for domains...");

    for (const d of domains) {
        try {
            const ips = await resolve4(d);
            console.log(`[IPv4 FOUND] ${d} -> ${ips.join(', ')}`);
        } catch (e) {
            console.log(`[NO IPv4] ${d}: ${e.code}`);
        }
    }
}

check();
