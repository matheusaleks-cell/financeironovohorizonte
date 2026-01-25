'use client';
import { useState, useEffect } from 'react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [form, setForm] = useState({ name: '', username: '', password: '', role: 'USER' });
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if current user is SUPER_ADMIN
        const cookie = document.cookie.split('; ').find(row => row.startsWith('session_user='));
        if (cookie) {
            const user = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
            if (user.role === 'SUPER_ADMIN') {
                setIsAdmin(true);
                fetchUsers();
            }
        }
    }, []);

    const fetchUsers = async () => {
        const res = await fetch('/api/users');
        const json = await res.json();
        setUsers(json);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Get Admin ID (Mock retrieval from session)
            const cookie = document.cookie.split('; ').find(row => row.startsWith('session_user='));
            const adminUser = cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : { id: 99 };

            const res = await fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify({ ...form, adminId: adminUser.id })
            });
            if (res.ok) {
                alert('Usuário criado!');
                setForm({ name: '', username: '', password: '', role: 'USER' });
                fetchUsers();
            } else {
                const err = await res.json();
                alert('Erro: ' + err.error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza? Isso impedirá o acesso deste usuário.')) return;
        const cookie = document.cookie.split('; ').find(row => row.startsWith('session_user='));
        const adminUser = cookie ? JSON.parse(decodeURIComponent(cookie.split('=')[1])) : { id: 99 };

        await fetch(`/api/users?id=${id}&adminId=${adminUser.id}`, { method: 'DELETE' });
        fetchUsers();
    };

    if (!isAdmin) return <div className="card text-danger">Acesso Negado. Apenas Suporte Técnico.</div>;

    return (
        <div className="animate-enter">
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Gestão de Usuários</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Controle de acesso do sistema (Área do Suporte)</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Novo Usuário</h3>
                    <form onSubmit={handleCreate}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nome Completo</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Login (Usuário)</label>
                            <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Senha Inicial</label>
                            <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Permissão</label>
                            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                <option value="USER">Operador Comum</option>
                                <option value="ADMIN">Sócio / Admin</option>
                                <option value="SUPER_ADMIN">Suporte Técnico</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Criando...' : 'Cadastrar Usuário'}
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Usuários Ativos</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Login</th>
                                <th>Função</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.username}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            background: u.role === 'SUPER_ADMIN' ? 'var(--text-main)' : (u.role === 'ADMIN' ? 'var(--primary)' : '#e2e8f0'),
                                            color: u.role === 'USER' ? 'black' : 'white'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        {u.role !== 'SUPER_ADMIN' && (
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                title="Excluir"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
