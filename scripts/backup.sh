#!/bin/sh

set -e

# Configuration
BACKUP_DIR="/backups"
BACKUP_RETENTION_DAYS=7
DB_NAME="service_scheduler"
DB_USER="postgres"
DB_HOST="db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"
ENCRYPTED_FILE="${BACKUP_FILE}.enc"
LOG_FILE="${BACKUP_DIR}/backup.log"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

# Encryption key should be provided via environment variable BACKUP_ENCRYPTION_KEY
if [ -z "$BACKUP_ENCRYPTION_KEY" ]; then
    echo "Error: BACKUP_ENCRYPTION_KEY environment variable is not set"
    exit 1
fi

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

update_backup_status() {
    local status=$1
    local message=$2
    local start_time=$3
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local size=$(stat -f%z "$ENCRYPTED_FILE" 2>/dev/null || echo "0")
    
    # Use Prisma to update backup status
    node -e "
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        
        async function updateStatus() {
            try {
                await prisma.backupStatus.create({
                    data: {
                        status: '$status',
                        timestamp: new Date(),
                        details: '$message',
                        filename: '${ENCRYPTED_FILE##*/}',
                        checksum: '$(cat $CHECKSUM_FILE 2>/dev/null || echo '')',
                        size: BigInt('$size'),
                        duration: $duration
                    }
                });
            } catch (error) {
                console.error('Failed to update backup status:', error);
            } finally {
                await prisma.$disconnect();
            }
        }
        
        updateStatus();
    "
}

# Start backup process
start_time=$(date +%s)
log_message "Starting backup process..."
update_backup_status "IN_PROGRESS" "Backup started" "$start_time"

# Perform backup and encrypt
if pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -F p | openssl enc -aes-256-cbc -salt -pbkdf2 -pass env:BACKUP_ENCRYPTION_KEY -out "$ENCRYPTED_FILE" 2>> "$LOG_FILE"; then
    log_message "Backup completed and encrypted successfully: $ENCRYPTED_FILE"
    
    # Generate checksum of encrypted file
    openssl dgst -sha256 "$ENCRYPTED_FILE" | cut -d' ' -f2 > "$CHECKSUM_FILE"
    log_message "Generated checksum: $(cat $CHECKSUM_FILE)"
    
    # Verify backup by attempting to decrypt a small portion
    if openssl enc -aes-256-cbc -d -salt -pbkdf2 -pass env:BACKUP_ENCRYPTION_KEY -in "$ENCRYPTED_FILE" -out /dev/null 2>/dev/null; then
        log_message "Backup verification successful"
        update_backup_status "SUCCESS" "Backup completed and verified successfully" "$start_time"
    else
        log_message "Backup verification failed"
        update_backup_status "FAILED" "Backup verification failed" "$start_time"
        exit 1
    fi
else
    log_message "Backup failed"
    update_backup_status "FAILED" "Backup process failed" "$start_time"
    exit 1
fi

# Cleanup old backups
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.enc" -mtime +${BACKUP_RETENTION_DAYS} -delete
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.sha256" -mtime +${BACKUP_RETENTION_DAYS} -delete

log_message "Cleanup of old backups completed"
log_message "Backup process finished successfully" 