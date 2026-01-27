'use client';
import { useState, useEffect } from 'react';

export default function FechamentoPage() {
    const [data, setData] = useState<any>(null);
    // Hydration safe: Initialize empty/static, then update on mount
    const [month, setMonth] = useState('1');
    const [year, setYear] = useState('2026');

    useEffect(() => {
        // Set to current date on client side only
        setMonth(String(new Date().getMonth() + 1));
        setYear(String(new Date().getFullYear()));
    }, []);
    const [loading, setLoading] = useState(false);

    const fetchSummary = async () => {
        const res = await fetch(`/api/summary?month=${month}&year=${year}`);
        const json = await res.json();
        setData(json);
    };

    useEffect(() => {
        fetchSummary();
    }, [month, year]);

    const handleLockMonth = async () => {
        if (!confirm('Tem certeza? Após fechar, ninguém poderá alterar transações deste mês!')) return;
        setLoading(true);
        try {
            await fetch('/api/closing', {
                method: 'POST',
                body: JSON.stringify({ month: parseInt(month), year: parseInt(year), ...data })
            });
            alert('Mês fechado com sucesso!');
            fetchSummary(); // Refresh to get status
        } catch (e) {
            alert('Erro ao fechar mês');
        } finally {
            setLoading(false);
        }
    };

    if (!data) return <div>Carregando...</div>;

    const profit = data.balance;
    const partnerShare = profit > 0 ? profit / 4 : 0;

    // Mock status check (ideally API returns this)
    const isClosed = false; // TODO: Fetch from API status

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Fechamento Mensal</h2>
                <p style={{ color: 'var(--text-muted)' }}>Apuração de resultados e divisão de lucros</p>
            </header>

            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select value={month} onChange={e => setMonth(e.target.value)} style={{ padding: '0.5rem' }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>
                    ))}
                </select>
                <select value={year} onChange={e => setYear(e.target.value)} style={{ padding: '0.5rem' }}>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                </select>
                <button onClick={fetchSummary} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Atualizar</button>
            </div>

            <div className="grid-dashboard">
                <div className="card">
                    <p style={{ color: 'var(--text-muted)' }}>Entradas</p>
                    <div className="stat-value text-success">R$ {data.income.toFixed(2)}</div>
                </div>
                <div className="card">
                    <p style={{ color: 'var(--text-muted)' }}>Saídas</p>
                    <div className="stat-value text-danger">R$ {data.expense.toFixed(2)}</div>
                </div>
                <div className="card">
                    <p style={{ color: 'var(--text-muted)' }}>Lucro Líquido</p>
                    <div className="stat-value" style={{ color: profit >= 0 ? 'var(--text-main)' : 'var(--danger)' }}>
                        R$ {profit.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Divisão entre Sócios</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Defina o valor repassado para cada parte. O sistema não calcula automático para dar liberdade.
                </p>

                {profit > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {/* Grupo 1 */}
                        <div style={{ padding: '1.5rem', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>FD</div>
                                <strong>Fernando & Daine</strong>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>50% da Sociedade</div>

                            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Valor Repassado (R$)</label>
                            <input
                                type="number"
                                placeholder="0,00"
                                style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)', padding: '0.5rem', width: '100%', marginTop: '0.25rem' }}
                            />
                        </div>

                        {/* Grupo 2 */}
                        <div style={{ padding: '1.5rem', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <div style={{ width: '32px', height: '32px', background: 'var(--text-secondary)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>MM</div>
                                <strong>Michel & Mayara</strong>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>50% da Sociedade</div>

                            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Valor Repassado (R$)</label>
                            <input
                                type="number"
                                placeholder="0,00"
                                style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--success)', padding: '0.5rem', width: '100%', marginTop: '0.25rem' }}
                            />
                        </div>
                    </div>
                ) : (
                    <p>Sem lucro para dividir neste período.</p>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleLockMonth}
                        disabled={loading}
                        style={{ background: 'var(--text-main)' }} // Distinct color
                    >
                        {loading ? 'Processando...' : '🔒 Travar Mês (Finalizar)'}
                    </button>
                </div>
            </div>
        </div>
    );
}
