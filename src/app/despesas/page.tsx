import { db } from '@/lib/db';
import TransactionForm from '@/components/TransactionForm';

export const dynamic = 'force-dynamic';

export default async function DespesasPage() {
    const categories = (await db.getCategories()).filter(c => c.type === 'EXPENSE');
    const transactions = (await db.getTransactions()).filter(t => t.type === 'EXPENSE').slice(0, 50);

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--danger)' }}>Despesas</h2>
                <p style={{ color: 'var(--text-muted)' }}>Controle de custos operacionais</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Nova Despesa</h3>
                    <TransactionForm type="EXPENSE" categories={categories} />
                </div>

                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Últimas Saídas</h3>
                    <div className="card">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '0.5rem' }}>Data</th>
                                    <th style={{ padding: '0.5rem' }}>Descrição</th>
                                    <th style={{ padding: '0.5rem' }}>Valor</th>
                                    <th style={{ padding: '0.5rem' }}>Resp.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>
                                            <div>{t.description}</div>
                                        </td>
                                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                                            R$ {t.amount.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.8rem' }}>Daine</td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum registro.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
