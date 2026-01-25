'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // This is a placeholder since Layout expects Sidebar. 
    // In a real app, Login would have a different Layout.
    // For this MVP, we assume user is logged in or this page redirects.
    // Actually, I need to implement basic redirection logic or just show this form.

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        if (res.ok) {
            window.location.href = '/';
        } else {
            const data = await res.json();
            alert(data.error || 'Erro ao entrar');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Acesso ao Sistema</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Usuário</label>
                    <input
                        className="input"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label>Senha</label>
                    <input
                        type="password"
                        className="input"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}>Entrar</button>
            </form>
        </div>
    );
}
