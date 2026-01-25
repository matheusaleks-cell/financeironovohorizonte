import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AuditoriaPage() {
    const allLogs = await db.getLogs();
    const logs = allLogs.reverse().slice(0, 100);

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Histórico e Auditoria</h2>
                <p style={{ color: 'var(--text-muted)' }}>Registro imutável de todas as ações no sistema</p>
            </header>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '0.5rem' }}>Data/Hora</th>
                            <th style={{ padding: '0.5rem' }}>Usuário</th>
                            <th style={{ padding: '0.5rem' }}>Ação</th>
                            <th style={{ padding: '0.5rem' }}>Detalhes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log: any) => (
                            <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem' }}>Daine</td>{/* Using mock user name as ID is 1 */}
                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                    <span style={{
                                        background: log.action === 'DELETE' ? '#fee2e2' : '#e0f2fe',
                                        color: log.action === 'DELETE' ? '#b91c1c' : '#0369a1',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        {log.action}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem' }}>{log.details}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center' }}>Nenhum registro encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
