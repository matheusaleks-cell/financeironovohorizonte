import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const allUsers = await db.getUsers();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const users = allUsers.map(({ password, ...u }) => u);
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, username, password, role, adminId } = body;

        // Basic RBAC
        const newUser = await db.addUser({ name, username, password, role });

        await db.logAction({
            action: 'CREATE',
            entity: 'User',
            entityId: String(newUser.id),
            details: `User Created: ${newUser.username} (${newUser.role})`,
            userId: adminId
        });

        return NextResponse.json({ success: true, user: newUser });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '');
        const adminId = parseInt(searchParams.get('adminId') || '');

        if (!id) throw new Error('ID required');

        await db.deleteUser(id);

        await db.logAction({
            action: 'DELETE',
            entity: 'User',
            entityId: String(id),
            details: `User Deleted (ID: ${id})`,
            userId: adminId
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}
