'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0, count: 0 });

  useEffect(() => {
    fetch('/api/summary')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="animate-enter">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Visão Geral</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Resumo financeiro em tempo real</p>
        </div>
        <div style={{
          padding: '0.5rem 1rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-secondary)'
        }}>
          📅 {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </header>

      <div className="grid-dashboard">
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Receitas</p>
              <div className="stat-value text-success">{formatCurrency(stats.income)}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#dcfce7', borderRadius: '12px', color: 'var(--success)', fontSize: '1.5rem' }}>💰</div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Despesas</p>
              <div className="stat-value text-danger">{formatCurrency(stats.expense)}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#fee2e2', borderRadius: '12px', color: 'var(--danger)', fontSize: '1.5rem' }}>📉</div>
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, var(--text-main) 0%, #0f172a 100%)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Saldo Atual</p>
              <div className="stat-value" style={{ color: 'white' }}>
                {formatCurrency(stats.balance)}
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1.5rem' }}>🏦</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Atividades Recentes</h3>
          <a href="/api/export" className="btn" style={{ background: 'var(--text-main)', color: 'white', fontSize: '0.8rem' }}>
            📥 Baixar Relatório Completo (CSV)
          </a>
        </div>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
          Nenhuma atividade registrada hoje. (Carregamento de lista pendente)
        </p>
      </div>
    </div>
  );
}
