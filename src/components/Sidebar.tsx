'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    if (pathname?.startsWith('/login')) return null;

    const [user, setUser] = useState<{ id: number; name: string; role: string } | null>(null);

    useEffect(() => {
        // Simple client-side check for UI.
        const cookie = document.cookie.split('; ').find(row => row.startsWith('session_user='));
        if (cookie) {
            try {
                const userData = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
                setUser(userData);
            } catch (e) { }
        }

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    }, [pathname]);

    const isAdmin = user?.role === 'SUPER_ADMIN';

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

    // Icons as components for cleaner SVG handling
    const Icons = {
        Dashboard: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
        Income: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
        Expense: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
        Closing: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
        Security: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
        Admin: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    };

    const links = [
        { href: '/', label: 'Visão Geral', icon: <Icons.Dashboard /> },
        { href: '/receitas', label: 'Receitas', icon: <Icons.Income /> },
        { href: '/despesas', label: 'Despesas', icon: <Icons.Expense /> },
        { href: '/fechamento', label: 'Fechamento', icon: <Icons.Closing /> },
        { href: '/relatorios', label: 'Relatórios', icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        { href: '/auditoria', label: 'Segurança', icon: <Icons.Security /> },
        ...(isAdmin ? [{ href: '/admin/users', label: 'Gestão Usuários', icon: <Icons.Admin /> }] : [])
    ];

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '28px', height: '28px', background: '#3b82f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span style={{ fontWeight: 600 }}>Pousada Finance</span>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: 'white' }}>
                    {isOpen ? (
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

            <aside className={`sidebar-desktop ${isOpen ? 'open' : ''}`} style={{
                width: '260px',
                background: 'var(--bg-sidebar)',
                borderRight: '1px solid #1e293b',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                zIndex: 50,
                color: '#e2e8f0'
            }}>
                <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: '#3b82f6',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                        }}>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'white', lineHeight: '1.2', letterSpacing: '-0.02em' }}>POUSADA<br /><span style={{ color: '#94a3b8', fontWeight: '400' }}>FINANCE PRO</span></h1>
                        </div>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {links.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.75rem',
                                borderRadius: '6px',
                                background: isActive ? '#1e293b' : 'transparent',
                                border: isActive ? '1px solid #334155' : '1px solid transparent',
                                color: isActive ? 'white' : '#94a3b8',
                                fontWeight: isActive ? '500' : '400',
                                transition: 'all 0.2s',
                                fontSize: '0.875rem'
                            }}>
                                <span style={{
                                    color: isActive ? '#60a5fa' : 'currentColor',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    {link.icon}
                                </span>
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
                            <p style={{ fontSize: '0.85rem', fontWeight: '500', color: 'white' }}>
                                {user ? user.name : 'Visitante'}
                            </p>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                {user?.role === 'SUPER_ADMIN' ? 'Mestre' : 'Usuário'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
