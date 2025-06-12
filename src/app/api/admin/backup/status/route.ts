import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    const where = {
      ...(type && { type }),
      ...(status && { status })
    }

    // Get backup status records
    const [backups, total] = await Promise.all([
      prisma.backupStatus.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.backupStatus.count({ where })
    ])

    // Calculate success rate
    const successRate = backups.length > 0
      ? (backups.filter((b: any) => b.status === 'completed').length / backups.length) * 100
      : 0

    // Get latest backup status
    const latestBackup = backups[0]
    const lastSuccessfulBackup = backups.find((b: any) => b.status === 'completed')

    return NextResponse.json({
      backups,
      total,
      metadata: {
        successRate,
        latestBackup: latestBackup ? {
          id: latestBackup.id,
          status: latestBackup.status,
          startedAt: latestBackup.timestamp
        } : null,
        lastSuccessfulBackup: lastSuccessfulBackup ? {
          id: lastSuccessfulBackup.id
        } : null
      }
    })
  } catch (error) {
    logger.error('Error fetching backup status', error as Error)
    return NextResponse.json(
      { error: 'Failed to fetch backup status' },
      { status: 500 }
    )
  }
} 