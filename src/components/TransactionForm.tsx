'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TransactionForm({ type, categories }: { type: 'INCOME' | 'EXPENSE', categories: any[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: '', // Start empty to avoid server/client mismatch
        categoryId: '',
        amount: '',
        paymentMethod: 'Pix',
        status: 'COMPLETED',
        description: '',
        proofUrl: ''
    });

    useEffect(() => {
        // Set default date on client mount
        setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get userId from cookie (same logic as DeleteTransactionButton)
            const userCookie = document.cookie.split('; ').find(row => row.startsWith('session_user='));
            let userId = 1; // Fallback
            if (userCookie) {
                try {
                    const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
                    userId = user.id;
                } catch (e) { }
            }

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    ...formData,
                    amount: parseFloat(formData.amount),
                    categoryId: parseInt(formData.categoryId),
                    userId: userId
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Erro desconhecido');
            }

            // Force reload to ensure data is updated
            alert('Registro salvo com sucesso!');
            window.location.reload();
        } catch (err: any) {
            alert(`Erro ao salvar: ${err.message || 'Erro de conexão'}`);
        } finally {
            setLoading(false);
        }
    };

    const isExpense = type === 'EXPENSE';

    return (
        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Data</label>
                <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    required
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                    {isExpense ? 'Categoria' : 'Origem'}
                </label>
                <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    required
                >
                    <option value="">Selecione...</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Descrição / Observação</label>
                <input
                    type="text"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder={isExpense ? 'Ex: Compra de lâmpadas' : 'Ex: Quarto 102'}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    required={isExpense}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Valor (R$)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Forma Pagamento</label>
                    <select
                        value={formData.paymentMethod}
                        onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    >
                        <option value="Pix">Pix</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Cartão">Cartão</option>
                        <option value="Transferência">Transferência</option>
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status</label>
                <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                >
                    <option value="COMPLETED">Pago / Recebido</option>
                    <option value="PENDING">Pendente (Agendado)</option>
                </select>
            </div>

            {isExpense && (
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Comprovante (URL opcional)</label>
                    <input
                        type="text"
                        value={formData.proofUrl}
                        onChange={e => setFormData({ ...formData, proofUrl: e.target.value })}
                        placeholder="http://..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', background: isExpense ? 'var(--danger)' : 'var(--primary)' }}
                disabled={loading}
            >
                {loading ? 'Salvando...' : (isExpense ? 'Registrar Despesa' : 'Registrar Receita')}
            </button>
        </form>
    );
}
