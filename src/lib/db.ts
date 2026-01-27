import { PrismaClient } from '@prisma/client';

// Prevent multiple instances in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const db = {
    // READ Methods
    getUsers: async () => {
        return await prisma.user.findMany({ where: { deletedAt: null } });
    },

    getCategories: async () => {
        return await prisma.category.findMany({ where: { deletedAt: null } });
    },

    getTransactions: async () => {
        return await prisma.transaction.findMany({
            where: { deletedAt: null },
            include: { category: true, user: true },
            orderBy: { date: 'desc' }
        });
    },

    getLogs: async () => {
        return await prisma.auditLog.findMany({
            orderBy: { timestamp: 'desc' }
        });
    },

    getClosings: async () => {
        return await prisma.monthlyClosing.findMany({
            orderBy: [{ year: 'desc' }, { month: 'desc' }]
        });
    },

    isMonthLocked: async (dateStr: string) => {
        const d = new Date(dateStr);
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        const existing = await prisma.monthlyClosing.findFirst({
            where: { month, year, status: 'CLOSED' }
        });
        return !!existing;
    },

    // WRITE Methods
    addUser: async (user: { name: string; username: string; role: string; password?: string }) => {
        return await prisma.user.create({
            data: {
                ...user,
                password: user.password || '123'
            }
        });
    },

    deleteUser: async (id: number) => {
        return await prisma.user.delete({ where: { id } });
    },

    addTransaction: async (tx: any) => {
        // Check Lock
        const isLocked = await db.isMonthLocked(tx.date);
        if (isLocked) throw new Error("Mês fechado. Não é possível adicionar transações.");

        // Fix date format for ISO
        const dateISO = new Date(tx.date).toISOString();

        return await prisma.transaction.create({
            data: {
                type: tx.type,
                amount: tx.amount,
                date: dateISO,
                description: tx.description,
                paymentMethod: tx.paymentMethod,
                proofUrl: tx.proofUrl,
                status: tx.status,
                userId: tx.userId,
                categoryId: tx.categoryId
            }
        });
    },

    updateTransaction: async (id: number, updates: any) => {
        const original = await prisma.transaction.findUnique({ where: { id } });
        if (!original) throw new Error("Transação não encontrada");

        // Check lock on original date
        if (await db.isMonthLocked(original.date.toISOString())) {
            throw new Error("Mês fechado (Data Original).");
        }

        // Check lock on new date if changed
        if (updates.date && updates.date !== original.date.toISOString()) {
            if (await db.isMonthLocked(updates.date)) {
                throw new Error("Mês fechado (Nova Data).");
            }
        }

        return await prisma.transaction.update({
            where: { id },
            data: updates
        });
    },

    deleteTransaction: async (id: number) => {
        // Soft Delete
        const original = await prisma.transaction.findUnique({ where: { id } });
        if (!original) throw new Error("Transação não encontrada");

        // Check lock (prevent deleting past records if month is locked)
        if (await db.isMonthLocked(original.date.toISOString())) {
            throw new Error("Mês fechado (Data Original).");
        }

        return await prisma.transaction.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    },

    logAction: async (log: { action: string; entity: string; entityId: string; details: string; userId: number }) => {
        await prisma.auditLog.create({
            data: log
        });
    },

    closeMonth: async (month: number, year: number, stats: any) => {
        const existing = await prisma.monthlyClosing.findFirst({
            where: { month, year }
        });

        const data = {
            month,
            year,
            totalIncome: stats.income,
            totalExpense: stats.expense,
            netProfit: stats.balance,
            distribution: JSON.stringify(stats.distribution || {}),
            status: 'CLOSED',
            closedAt: new Date()
        };

        if (existing) {
            return await prisma.monthlyClosing.update({
                where: { id: existing.id },
                data
            });
        } else {
            return await prisma.monthlyClosing.create({ data });
        }
    },

    // Push Notifications
    saveSubscription: async (sub: any) => {
        return await prisma.pushSubscription.create({
            data: {
                endpoint: sub.endpoint,
                keys: JSON.stringify(sub.keys)
            }
        });
    },

    getPushSubscriptions: async () => {
        return await prisma.pushSubscription.findMany();
    }
};
