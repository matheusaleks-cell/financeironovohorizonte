import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a dedicated instance for testing to capture connection errors explicitly
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export const dynamic = 'force-dynamic';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL || 'NOT_DEFINED';

    // Safe Log: Hide password
    const hiddenUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');

    const diagnostics = {
        env_url_format: hiddenUrl,
        connection_status: 'PENDING',
        error_details: null as any,
        user_count: -1
    };

    try {
        // Attempt simple query with timeout
        const userCount = await prisma.user.count();

        diagnostics.connection_status = 'SUCCESS';
        diagnostics.user_count = userCount;

    } catch (e: any) {
        diagnostics.connection_status = 'FAILED';
        diagnostics.error_details = {
            message: e.message,
            code: e.code,
            meta: e.meta,
            name: e.name
        };
    } finally {
        await prisma.$disconnect();
    }

    return NextResponse.json(diagnostics);
}
