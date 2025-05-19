import { NextResponse } from 'next/server'
import { runBackup } from '@/scripts/backup'
import { logger } from '@/lib/logger'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const loggerInstance = logger.child({ service: 'backup-api' })

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Start backup
    loggerInstance.info('Manual backup initiated by admin')
    const result = await runBackup()

    return NextResponse.json({
      message: 'Backup completed successfully',
      result
    })
  } catch (error) {
    loggerInstance.error('Backup API error', error as Error)
    return NextResponse.json(
      { error: 'Failed to run backup' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // List recent backups
    // Implementation depends on your S3 structure
    // Add S3 list logic here

    return NextResponse.json({
      message: 'Recent backups retrieved',
      backups: []
    })
  } catch (error) {
    loggerInstance.error('Backup list API error', error as Error)
    return NextResponse.json(
      { error: 'Failed to list backups' },
      { status: 500 }
    )
  }
} 