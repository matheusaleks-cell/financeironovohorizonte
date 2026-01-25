import webpush from 'web-push';
import { db } from '@/lib/db';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BEEpPU0ptZ2eBlOFpdB4ItaOObUCHsrS0Qni-WNIzKdjO3PJvur9qJQyMi9IaeMoWBflFxlDdytHxYawGP_hqkM";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "SUbAgHBf04Bsh4lS5R1u9x_FZs3hJz0tP2FyrfM-QvE";

webpush.setVapidDetails(
    'mailto:admin@pousada.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

export async function sendPushNotification(title: string, body: string, url: string = '/') {
    const subscriptions = await db.getPushSubscriptions();

    const payload = JSON.stringify({ title, body, url });

    subscriptions.forEach(sub => {
        const pushConfig = {
            endpoint: sub.endpoint,
            keys: JSON.parse(sub.keys)
        };

        webpush.sendNotification(pushConfig, payload).catch(err => console.error("Push Error", err));
    });
}
