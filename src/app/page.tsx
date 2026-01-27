'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0, count: 0 });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/summary')
      .then(res => res.json())
      .then(data => setStats(data));

    fetch('/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data));
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
          📅 {new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </header>

      <div className="grid-dashboard">
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Receitas</p>
              <div className="stat-value text-success">{formatCurrency(stats.income)}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', color: 'var(--success)', fontSize: '1.25rem', border: '1px solid #bbf7d0' }}>💰</div>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Despesas</p>
              <div className="stat-value text-danger">{formatCurrency(stats.expense)}</div>
            </div>
            <div style={{ padding: '0.75rem', background: '#fef2f2', borderRadius: '8px', color: 'var(--danger)', fontSize: '1.25rem', border: '1px solid #fecaca' }}>📉</div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saldo Atual</p>
              <div className="stat-value" style={{ color: 'white' }}>
                {formatCurrency(stats.balance)}
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '1.25rem' }}>🏦</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Atividades Recentes</h3>
          <a href="/api/export" className="btn" style={{ background: 'var(--text-main)', color: 'white', fontSize: '0.8rem' }}>
            📥 Baixar Relatório Completo (CSV)
          </a>
        </div>

        {activities.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Nenhuma atividade recente.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activities.map((log: any) => (
              <div key={log.id} style={{
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: '6px',
                borderLeft: log.action === 'DELETE' ? '3px solid var(--danger)' : '3px solid var(--primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{log.details.replace('Created', 'Criado').replace('Status', 'Situação').replace('INCOME', 'Receita').replace('EXPENSE', 'Despesa')}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {log.action === 'DELETE' ? 'Exclusão' : log.action === 'CREATE' ? 'Criação' : log.action === 'UPDATE_PASSWORD' ? 'Senha Alterada' : log.action} • {new Date(log.timestamp).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                  </p>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Daine
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
