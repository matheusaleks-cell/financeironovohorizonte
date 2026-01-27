import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        status: 'ALIVE',
        message: 'The diagnostic route is reachable!',
        env_check: process.env.DATABASE_URL ? 'DEFINED' : 'MISSING'
    });
}
