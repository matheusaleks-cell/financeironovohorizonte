'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    if (pathname?.startsWith('/login')) return null;

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Simple client-side check for UI.
        const cookie = document.cookie.split('; ').find(row => row.startsWith('session_user='));
        if (cookie) {
            try {
                const user = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
                if (user.role === 'SUPER_ADMIN') setIsAdmin(true);
            } catch (e) { }
        }

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
        { href: '/fechamento', label: 'Fechamento', icon: '📋' },
        { href: '/auditoria', label: 'Segurança', icon: '🛡️' },
        ...(isAdmin ? [{ href: '/admin/users', label: 'Gestão Usuários', icon: '⚙️' }] : [])
    ];

    return (
        <aside style={{
            width: '260px', /* Slightly narrower */
            background: 'var(--bg-sidebar)', /* Dark Slate */
            borderRight: '1px solid #1e293b',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
            color: 'white'
        }}>
            <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: '#3b82f6', /* Corporate Blue */
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        PF
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', lineHeight: '1.2' }}>POUSADA<br /><span style={{ color: '#94a3b8' }}>FINANCE PRO</span></h1>
                    </div>
                </div>
            </div>

            <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {links.map(link => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.href} href={link.href} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '4px',
                            background: isActive ? '#1e293b' : 'transparent',
                            color: isActive ? 'white' : '#94a3b8',
                            fontWeight: isActive ? '500' : '400',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem'
                        }}>
                            <span style={{ fontSize: '1.1rem', opacity: isActive ? 1 : 0.7 }}>{link.icon}</span>
                            {link.label}
                        </Link>
                    );
                })}

                <button
                    onClick={subscribeToPush}
                    style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        color: '#fbbf24',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        textAlign: 'left'
                    }}
                >
                    🔔 Ativar Notificações
                </button>
            </nav>

            <div style={{ padding: '1.5rem', borderTop: '1px solid #1e293b' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: '#334155',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem'
                    }}>👤</div>
                    <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: '500', color: 'white' }}>Daine</p>
                        <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Administrador</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
