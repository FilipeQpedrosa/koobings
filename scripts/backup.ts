import { exec } from 'child_process'
import { promisify } from 'util'
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { createReadStream, createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'
import { env } from '@/lib/env'
import { log } from '@/lib/logger'
import { PrismaClient } from '@prisma/client'
import { statSync } from 'fs'

const execAsync = promisify(exec)
const logger = log.child({ service: 'backup' })
const prisma = new PrismaClient()

const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

interface BackupOptions {
  type: 'full' | 'incremental'
  retention: number // days
}

async function createDatabaseBackup(options: BackupOptions) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(process.cwd(), 'backups')
  const filename = `backup-${options.type}-${timestamp}.sql`
  const filePath = path.join(backupPath, filename)

  // Create backup status record
  const backupStatus = await prisma.backupStatus.create({
    data: {
      type: options.type,
      status: 'running',
      metadata: {
        retention: options.retention,
        filename,
      }
    }
  })

  try {
    // Create backup using pg_dump
    logger.info('Starting database backup', { type: options.type, backupId: backupStatus.id })
    await execAsync(`pg_dump ${env.DATABASE_URL} > ${filePath}`)

    // Get file size
    const stats = statSync(filePath)
    await prisma.backupStatus.update({
      where: { id: backupStatus.id },
      data: { sizeBytes: stats.size }
    })

    // Compress the backup
    logger.info('Compressing backup', { backupId: backupStatus.id })
    await execAsync(`gzip ${filePath}`)
    const compressedPath = `${filePath}.gz`

    // Upload to S3
    logger.info('Uploading to S3', { backupId: backupStatus.id })
    const fileStream = createReadStream(compressedPath)
    const s3Path = `backups/${options.type}/${filename}.gz`
    
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_BACKUP_BUCKET,
        Key: s3Path,
        Body: fileStream,
        ServerSideEncryption: 'AES256',
        Metadata: {
          'backup-type': options.type,
          'created-at': timestamp,
          'database-version': await getDatabaseVersion(),
          'backup-id': backupStatus.id
        },
      })
    )

    // Update status before verification
    await prisma.backupStatus.update({
      where: { id: backupStatus.id },
      data: {
        s3Path,
        verificationStatus: 'pending'
      }
    })

    // Verify backup
    await verifyBackup(compressedPath, backupStatus.id)

    // Cleanup old backups
    await cleanupOldBackups(options.retention)

    // Update final status
    await prisma.backupStatus.update({
      where: { id: backupStatus.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        verificationStatus: 'success'
      }
    })

    logger.info('Backup completed successfully', {
      type: options.type,
      path: s3Path,
      backupId: backupStatus.id
    })

    return {
      success: true,
      path: s3Path,
      timestamp,
      backupId: backupStatus.id
    }
  } catch (error) {
    logger.error('Backup failed', error as Error)
    
    // Update error status
    await prisma.backupStatus.update({
      where: { id: backupStatus.id },
      data: {
        status: 'failed',
        completedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
        verificationStatus: 'failed'
      }
    })

    throw error
  }
}

async function verifyBackup(backupPath: string, backupId: string) {
  logger.info('Verifying backup', { path: backupPath, backupId })
  
  try {
    // Create a temporary database for verification
    const verifyDbName = `verify_${Date.now()}`
    await execAsync(`createdb ${verifyDbName}`)

    // Restore backup to temporary database
    await execAsync(`gunzip -c ${backupPath} | psql ${verifyDbName}`)

    // Run comprehensive verification queries
    const verificationQueries = [
      // Check business table and relationships
      "SELECT COUNT(*) as business_count FROM business WHERE NOT isDeleted",
      "SELECT COUNT(*) as staff_count FROM staff WHERE businessId IN (SELECT id FROM business WHERE NOT isDeleted)",
      "SELECT COUNT(*) as appointments_count FROM appointments WHERE businessId IN (SELECT id FROM business WHERE NOT isDeleted)",
      
      // Verify data integrity
      "SELECT COUNT(*) as orphaned_staff FROM staff WHERE businessId NOT IN (SELECT id FROM business)",
      "SELECT COUNT(*) as orphaned_appointments FROM appointments WHERE businessId NOT IN (SELECT id FROM business)",
      
      // Check critical configurations
      "SELECT COUNT(*) as business_hours FROM business_hours WHERE businessId IN (SELECT id FROM business WHERE NOT isDeleted)",
      "SELECT COUNT(*) as security_settings FROM security_settings WHERE businessId IN (SELECT id FROM business WHERE NOT isDeleted)"
    ]

    // Execute all verification queries
    const results = await Promise.all(
      verificationQueries.map(query => 
        execAsync(`psql ${verifyDbName} -t -A -c "${query}"`)
      )
    )

    // Log verification results
    const verificationResults = results.map((result, index) => ({
      query: verificationQueries[index],
      result: result.stdout.trim()
    }))

    // Update backup status with verification results
    await prisma.backupStatus.update({
      where: { id: backupId },
      data: {
        metadata: {
          verification: verificationResults
        }
      }
    })

    // Verify no orphaned records exist
    const orphanedStaff = parseInt(results[3].stdout)
    const orphanedAppointments = parseInt(results[4].stdout)

    if (orphanedStaff > 0 || orphanedAppointments > 0) {
      throw new Error(`Data integrity check failed: Found orphaned records (Staff: ${orphanedStaff}, Appointments: ${orphanedAppointments})`)
    }

    // Cleanup
    await execAsync(`dropdb ${verifyDbName}`)

    logger.info('Backup verification successful', { backupId })
    return true
  } catch (error) {
    logger.error('Backup verification failed', error as Error)
    throw error
  }
}

async function cleanupOldBackups(retentionDays: number) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

  logger.info('Cleaning up old backups', { retentionDays, cutoffDate })

  try {
    // List old backups from S3
    const { ListObjectsV2Command, DeleteObjectsCommand } = await import('@aws-sdk/client-s3')
    
    let continuationToken: string | undefined
    const objectsToDelete: { Key: string }[] = []

    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: env.AWS_BACKUP_BUCKET,
        Prefix: 'backups/',
        ContinuationToken: continuationToken
      })

      const response = await s3Client.send(listCommand)
      continuationToken = response.NextContinuationToken

      // Filter objects older than retention period
      const oldObjects = (response.Contents || []).filter((obj: { LastModified?: Date; Key?: string }) => {
        const lastModified = obj.LastModified
        return lastModified && lastModified < cutoffDate
      })

      // Add to deletion queue
      objectsToDelete.push(...oldObjects.map((obj: { Key?: string }) => ({ Key: obj.Key || '' })))

      // Delete in batches of 1000 (S3 limit)
      while (objectsToDelete.length >= 1000) {
        const batch = objectsToDelete.splice(0, 1000)
        await s3Client.send(new DeleteObjectsCommand({
          Bucket: env.AWS_BACKUP_BUCKET,
          Delete: { Objects: batch }
        }))
        logger.info('Deleted batch of old backups from S3', { count: batch.length })
      }
    } while (continuationToken)

    // Delete remaining objects
    if (objectsToDelete.length > 0) {
      await s3Client.send(new DeleteObjectsCommand({
        Bucket: env.AWS_BACKUP_BUCKET,
        Delete: { Objects: objectsToDelete }
      }))
      logger.info('Deleted remaining old backups from S3', { count: objectsToDelete.length })
    }

    // Clean up local backup files
    await execAsync(`find backups/ -type f -mtime +${retentionDays} -delete`)
    
    logger.info('Backup cleanup completed', {
      retentionDays,
      totalDeleted: objectsToDelete.length
    })
  } catch (error) {
    logger.error('Cleanup failed', error as Error)
    throw error
  }
}

async function getDatabaseVersion(): Promise<string> {
  const { stdout } = await execAsync('psql --version')
  return stdout.trim()
}

export async function runBackup() {
  // Run full backup daily
  await createDatabaseBackup({
    type: 'full',
    retention: 30, // Keep for 30 days
  })

  // Run incremental backup every 6 hours
  await createDatabaseBackup({
    type: 'incremental',
    retention: 7, // Keep for 7 days
  })
} 