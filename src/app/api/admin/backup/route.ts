import { NextResponse } from 'next/server'
import { runBackup } from '@/scripts/backup'
import { logger } from '@/lib/logger'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const loggerInstance = logger.child({ service: 'backup-api' })

export async function POST(_request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // Start backup
    loggerInstance.info('Manual backup initiated by admin')
    const result = await runBackup()

    return NextResponse.json({
      success: true,
      data: {
        message: 'Backup completed successfully',
        result
      }
    })
  } catch (error) {
    loggerInstance.error('Backup API error', error as Error)
    return NextResponse.json(
      { success: false, error: { code: 'BACKUP_ERROR', message: 'Failed to run backup' } },
      { status: 500 }
    )
  }
}

export async function GET(_request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 })
    }

    // List recent backups
    // Implementation depends on your S3 structure
    // Add S3 list logic here

    return NextResponse.json({
      success: true,
      data: {
        message: 'Recent backups retrieved',
        backups: []
      }
    })
  } catch (error) {
    loggerInstance.error('Backup list API error', error as Error)
    return NextResponse.json(
      { success: false, error: { code: 'BACKUP_LIST_ERROR', message: 'Failed to list backups' } },
      { status: 500 }
    )
  }
} 