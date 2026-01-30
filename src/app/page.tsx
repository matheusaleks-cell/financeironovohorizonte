'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0, count: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Date State
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  useEffect(() => {
    // Determine month/year from end date for the summary cards context
    const d = parseISO(endDate);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    fetch(`/api/summary?month=${month}&year=${year}`)
      .then(res => res.json())
      .then(data => setStats(data));

    fetch('/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data));

    fetch(`/api/chart-data?startDate=${startDate}&endDate=${endDate}`)
      .then(res => res.json())
      .then(data => setChartData(data));

  }, [startDate, endDate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="animate-enter">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Visão Geral</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Resumo financeiro em tempo real</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Início</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                background: 'white'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Fim</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                background: 'white'
              }}
            />
          </div>
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
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saldo Líquido</p>
              <div className="stat-value" style={{ color: 'white' }}>
                {formatCurrency(stats.balance)}
              </div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '1.25rem' }}>🏦</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem', height: '400px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Fluxo Financeiro (Receitas x Despesas)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: any) => [formatCurrency(value || 0), '']}
            />
            <Area type="monotone" dataKey="income" stroke="var(--success)" fillOpacity={1} fill="url(#colorIncome)" name="Receitas" strokeWidth={2} />
            <Area type="monotone" dataKey="expense" stroke="var(--danger)" fillOpacity={1} fill="url(#colorExpense)" name="Despesas" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
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

