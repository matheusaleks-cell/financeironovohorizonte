'use client';

import { useState } from 'react';

export default function RelatoriosPage() {
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState(String(new Date().getMonth() + 1));
    const [year, setYear] = useState(String(new Date().getFullYear()));

    const handleExport = async (type: 'monthly' | 'full') => {
        setLoading(true);
        try {
            const query = type === 'monthly' ? `?month=${month}&year=${year}` : '?full=true';
            const res = await fetch(`/api/export${query}`);

            if (!res.ok) throw new Error('Erro ao gerar relatório');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio-financeiro-${type === 'monthly' ? `${month}-${year}` : 'completo'}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (e) {
            alert('Erro ao baixar relatório');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-enter">
            <header style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Relatórios Financeiros</h2>
                <p style={{ color: 'var(--text-muted)' }}>Exportação de dados para contabilidade e controle</p>
            </header>

            <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Monthly Report Card */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📅 Relatório Mensal
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Exporta apenas as movimentações do mês selecionado. Ideal para fechamento de caixa.
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <select
                            value={month}
                            onChange={e => setMonth(e.target.value)}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        >
                            {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>
                            ))}
                        </select>
                        <select
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            style={{ width: '80px', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        >
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>

                    <button
                        onClick={() => handleExport('monthly')}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {loading ? 'Gerando...' : (
                            <>
                                📊 Baixar Planilha Excel (.xlsx)
                            </>
                        )}
                    </button>
                </div>

                {/* Full Report Card */}
                <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🗂️ Relatório Completo
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Exporta TODO o histórico financeiro desde o início do uso do sistema. Pode demorar um pouco mais.
                    </p>

                    <div style={{ height: '42px', marginBottom: '1rem' }}></div> {/* Spacer to align buttons */}

                    <button
                        onClick={() => handleExport('full')}
                        disabled={loading}
                        className="btn"
                        style={{
                            width: '100%',
                            background: '#f1f5f9',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        📥 Baixar Histórico Completo
                    </button>
                </div>
            </div>
        </div>
    );
}
