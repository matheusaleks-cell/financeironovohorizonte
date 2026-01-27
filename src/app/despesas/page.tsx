import { db } from '@/lib/db';
import TransactionForm from '@/components/TransactionForm';

export const dynamic = 'force-dynamic';

export default async function DespesasPage() {
    const categories = (await db.getCategories()).filter((c: any) => c.type === 'EXPENSE');
    const transactions = (await db.getTransactions()).filter((t: any) => t.type === 'EXPENSE').slice(0, 50);

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
                        <table>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Resp.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t: any) => (
                                    <tr key={t.id}>
                                        <td>{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            <div>{t.description}</div>
                                        </td>
                                        <td style={{ fontWeight: 600, color: 'var(--danger)' }}>
                                            R$ {t.amount.toFixed(2)}
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Daine</td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr><td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum registro encontrado.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
