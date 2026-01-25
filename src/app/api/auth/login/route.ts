import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    const { username, password } = await request.json();
    const users = await db.getUsers();

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Set cookie for simple auth
    const response = NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } });
    response.cookies.set('session_user', JSON.stringify({ id: user.id, name: user.name, role: user.role }), {
        path: '/',
        httpOnly: false // Allow client reading for simple UI logic
    });

    await db.logAction({
        action: 'LOGIN',
        entity: 'User',
        entityId: String(user.id),
        details: 'User logged in',
        userId: user.id
    });

    return response;
}
