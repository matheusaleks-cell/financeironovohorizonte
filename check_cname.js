const dns = require('dns');
const { promisify } = require('util');
const resolveCname = promisify(dns.resolveCname);

const domain = 'db.rkpfxlcveftnljukeypu.supabase.co';

async function check() {
    try {
        const cnames = await resolveCname(domain);
        console.log(`CNAME: ${cnames.join(', ')}`);
    } catch (e) {
        console.log(`Error resolving CNAME: ${e.code}`);
    }
}

check();
