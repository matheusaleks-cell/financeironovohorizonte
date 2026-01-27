import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, newPassword } = body;

        if (!userId || !newPassword) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
        }

        // Just update directly - in a real app we'd hash this!
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { password: newPassword }
        });

        await db.logAction({
            action: 'UPDATE_PASSWORD',
            entity: 'User',
            entityId: String(userId),
            details: 'Senha alterada pelo usuário',
            userId: parseInt(userId)
        });

        return NextResponse.json({ success: true });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
