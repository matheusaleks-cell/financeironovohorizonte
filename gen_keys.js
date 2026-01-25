const webpush = require('web-push');
const fs = require('fs');

const vapidKeys = webpush.generateVAPIDKeys();

const content = `NEXT_PUBLIC_VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"
VAPID_PRIVATE_KEY="${vapidKeys.privateKey}"
NEXT_PUBLIC_VAPID_MAILTO="mailto:admin@pousada.com"`;

console.log(content);
fs.writeFileSync('vapid_keys.txt', content);
