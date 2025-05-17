import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the latest backup status
    const latestBackup = await prisma.backupStatus.findFirst({
      orderBy: {
        timestamp: 'desc'
      }
    });

    // Get backup statistics
    const [
      totalBackups,
      successfulBackups,
      failedBackups
    ] = await Promise.all([
      prisma.backupStatus.count(),
      prisma.backupStatus.count({
        where: { status: 'SUCCESS' }
      }),
      prisma.backupStatus.count({
        where: { status: 'FAILED' }
      })
    ]);

    // Get recent backup history
    const recentBackups = await prisma.backupStatus.findMany({
      take: 10,
      orderBy: {
        timestamp: 'desc'
      }
    });

    return NextResponse.json({
      latest: latestBackup,
      statistics: {
        total: totalBackups,
        successful: successfulBackups,
        failed: failedBackups,
        successRate: totalBackups > 0 ? (successfulBackups / totalBackups) * 100 : 0
      },
      recentHistory: recentBackups
    });
  } catch (error) {
    console.error('Failed to fetch backup status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backup status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 