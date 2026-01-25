'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    if (pathname?.startsWith('/login')) return null;

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Simple client-side check for UI. Real security is on the page/API.
        const cookie = document.cookie.split('; ').find(row => row.startsWith('session_user='));
        if (cookie) {
            try {
                const user = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
                if (user.role === 'SUPER_ADMIN') setIsAdmin(true);
            } catch (e) { }
        }

        // Service Worker Reg
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    }, [pathname]);

    const subscribeToPush = async () => {
        if (!('serviceWorker' in navigator)) return;
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: "BEEpPU0ptZ2eBlOFpdB4ItaOObUCHsrS0Qni-WNIzKdjO3PJvur9qJQyMi9IaeMoWBflFxlDdytHxYawGP_hqkM"
            });
            await fetch('/api/subscribe', {
                method: 'POST',
                body: JSON.stringify(sub)
            });
            alert('Notificações ativadas com sucesso! 🔔');
        }
    };

    const links = [
        { href: '/', label: 'Visão Geral', icon: '📊' },
        { href: '/receitas', label: 'Receitas', icon: '💰' },
        { href: '/despesas', label: 'Despesas', icon: '💸' },
        { href: '/fechamento', label: 'Fechamento', icon: '🤝' },
        { href: '/auditoria', label: 'Segurança', icon: '🛡️' },
        ...(isAdmin ? [{ href: '/admin/users', label: 'Gestão Usuários', icon: '⚙️' }] : [])
    ];

    return (
        <aside style={{
            width: '280px',
            background: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
            boxShadow: 'var(--shadow-md)'
        }}>
            <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    boxShadow: '0 4px 12px rgba(15, 118, 110, 0.3)'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🏨</span>
                </div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>POUSADA<br /><span style={{ color: 'var(--primary)' }}>FINANCE PRO</span></h1>
            </div>

            <nav style={{ flex: 1, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {links.map(link => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem 1.25rem',
                            borderRadius: '16px',
                            background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'transparent',
                            color: isActive ? 'white' : 'var(--text-secondary)',
                            fontWeight: isActive ? '600' : '500',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: isActive ? '0 8px 16px -4px rgba(13, 148, 136, 0.3)' : 'none',
                            transform: isActive ? 'scale(1.02)' : 'none'
                        }}>
                            <span style={{ fontSize: '1.25rem' }}>{link.icon}</span>
                            {link.label}
                        </Link>
                    );
                })}

                <button
                    onClick={subscribeToPush}
                    style={{
                        marginTop: 'auto', // Pushes to bottom
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,166,0,0.1)',
                        border: '1px solid rgba(255,166,0,0.3)',
                        borderRadius: '8px',
                        color: '#fbbf24',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textAlign: 'left'
                    }}
                >
                    🔔 Ativar Notificações
                </button>
            </nav>

            <div style={{ padding: '2rem', borderTop: '1px solid var(--border)' }}>
                <div style={{
                    padding: '1rem',
                    background: 'var(--bg-app)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: '#cbd5e1',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>👤</div>
                    <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>Daine</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Administrador</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
