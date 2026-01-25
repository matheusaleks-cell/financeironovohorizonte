import { db } from '@/lib/db';
import TransactionForm from '@/components/TransactionForm';

export default async function ReceitasPage() {
    const categories = (await db.getCategories()).filter(c => c.type === 'INCOME');
    const transactions = (await db.getTransactions()).filter(t => t.type === 'INCOME').slice(0, 50);

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>Receitas</h2>
                <p style={{ color: 'var(--text-muted)' }}>Registre as entradas da pousada</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Nova Receita</h3>
                    <TransactionForm type="INCOME" categories={categories} />
                </div>

                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Últimas Entradas</h3>
                    <div className="card">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '0.5rem' }}>Data</th>
                                    <th style={{ padding: '0.5rem' }}>Origem</th>
                                    <th style={{ padding: '0.5rem' }}>Valor</th>
                                    <th style={{ padding: '0.5rem' }}>Resp.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                                        <td style={{ padding: '0.75rem 0.5rem' }}>{t.description}</td>
                                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
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
