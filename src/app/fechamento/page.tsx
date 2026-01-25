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
                <h3 style={{ marginBottom: '1rem' }}>Divisão entre Sócios (4)</h3>
                {profit > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {['Daine', 'Fernando', 'Michel', 'Mayara'].map(p => (
                            <div key={p} style={{ padding: '1rem', background: 'var(--bg-app)', borderRadius: '8px' }}>
                                <strong>{p}</strong>
                                <div style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>R$ {partnerShare.toFixed(2)}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Disponível para saque</div>
                            </div>
                        ))}
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
