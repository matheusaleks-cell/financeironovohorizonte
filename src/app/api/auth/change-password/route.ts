import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { userId, newPassword, confirmPassword } = await request.json();

        if (!userId || !newPassword || !confirmPassword) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ error: 'As senhas não coincidem' }, { status: 400 });
        }

        // Update user
        await prisma.user.update({
            where: { id: Number(userId) },
            data: {
                password: newPassword,
                mustChangePassword: false
            }
        });

        // Log action
        await db.logAction({
            action: 'CHANGE_PASSWORD',
            entity: 'User',
            entityId: String(userId),
            details: 'First time password change completed',
            userId: Number(userId)
        });

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error("Change Password Error:", e);
        return NextResponse.json({ error: 'Erro ao alterar senha' }, { status: 500 });
    }
}
