'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteTransactionButton({ id }: { id: number }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este lançamento?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/transactions?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                // Refresh data
                router.refresh();
            } else {
                const json = await res.json();
                alert(json.error || 'Erro ao excluir');
            }
        } catch (e) {
            alert('Erro de conexão ao excluir');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#ef4444',
                padding: '0.25rem'
            }}
            aria-label="Excluir"
        >
            {loading ? '...' : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )}
        </button>
    );
}
