'use client';

import { useState } from 'react';

export default function ChangePasswordForm() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCookie = document.cookie.split('; ').find(row => row.startsWith('session_user='));
            if (!userCookie) return alert('Erro: Usuário não identificado');

            const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));

            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({ userId: user.id, newPassword: password })
            });

            if (res.ok) {
                alert('Senha alterada com sucesso! 🔒');
                setPassword('');
            } else {
                const json = await res.json();
                alert(json.error || 'Erro ao alterar senha');
            }
        } catch (e) {
            alert('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Segurança do Usuário</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Nova Senha
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Digite a nova senha..."
                        required
                        minLength={4}
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Processando...' : 'Alterar Senha'}
                </button>
            </form>
        </div>
    );
}
