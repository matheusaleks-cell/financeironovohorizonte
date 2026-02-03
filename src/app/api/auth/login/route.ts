import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        console.log(`[AUTH] Attempt for: ${username}`); // Log attempt (server-side only)

        const allUsers = await db.getUsers();

        // Normalize comparison
        const user = allUsers.find(u =>
            u.username.toLowerCase().trim() === username.toLowerCase().trim() &&
            u.password === password
        );

        if (!user) {
            console.error(`[AUTH] Failed: User not found or password mismatch for ${username}`);
            return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
        }

        // Check if password change is required
        if (user.mustChangePassword) {
            return NextResponse.json({
                mustChangePassword: true,
                userId: user.id
            });
        }

        // Set cookie for simple auth (ONLY if no password change needed)
        const response = NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } });
        response.cookies.set('session_user', JSON.stringify({ id: user.id, name: user.name, role: user.role }), {
            path: '/',
            httpOnly: false // Allow client reading for simple UI logic
        });

        // Async log
        db.logAction({
            action: 'LOGIN',
            entity: 'User',
            entityId: String(user.id),
            details: 'User logged in',
            userId: user.id
        }).catch(e => console.error("Login Log Error", e));

        return response;
    } catch (e: any) {
        console.error(`[AUTH] Error: ${e.message}`);
        // EXPOSING ERROR FOR DEBUGGING
        return NextResponse.json({ error: `Erro técnico: ${e.message}` }, { status: 500 });
    }
}
