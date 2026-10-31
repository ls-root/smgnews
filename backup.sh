#!/usr/bin/env bash
# This script expects to be run from the root of the repository

set -euo pipefail
umask 077

BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/smgnews}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
LOCKDIR="${LOCKDIR:-/run/lock/smgnews-backup.lock}"

if [[ ! -f docker-compose.yml ]]; then
  echo "Error: run this script from the repository root." >&2
  exit 1
fi

acquire_lock() {
  if mkdir "$LOCKDIR" 2>/dev/null; then
    echo $$ > "$LOCKDIR/pid"
    return 0
  fi

  # Lockdir already exists
  if [[ -f "$LOCKDIR/pid" ]] && kill -0 "$(cat "$LOCKDIR/pid")" 2>/dev/null; then
    return 1
  fi
}

if ! acquire_lock; then
  echo "Cannot acquire lock on $LOCKDIR"
  exit 0
fi

echo "Successfully acquired lock on $LOCKDIR"

BACKUP_DIR=""

# Check if stack is running
containers=("mariadb" "postgres" "web" "wordpress")
for container in "${containers[@]}"; do
  if [[ -z "$(docker compose ps -q "$container")" ]]; then
    echo "Error: $container is not running. Aborting."
    exit 1
  fi
done

# Create backup directory
BASE_DATE=$(date +%d-%m-%y)
BACKUP_DIR="$BACKUP_ROOT/$BASE_DATE"
i=1
while [[ -d "$BACKUP_DIR" ]]; do
  BACKUP_DIR="$BACKUP_ROOT/$BASE_DATE-$i"
  i=$((i + 1))
done
mkdir -p "$BACKUP_ROOT"
chmod 700 "$BACKUP_ROOT"
mkdir "$BACKUP_DIR"

# Backup postgres
echo "Backing up PostgreSQL..."
docker compose exec -T postgres pg_dumpall -U postgres | gzip -c > "$BACKUP_DIR/postgres.sql.gz"
[[ -s "$BACKUP_DIR/postgres.sql.gz" ]]

echo "Backing up MariaDB..."
docker compose exec -T mariadb sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mariadb-dump -u "$MYSQL_USER" --single-transaction --quick --default-character-set=utf8mb4 "$MYSQL_DATABASE"' | gzip -c > "$BACKUP_DIR/wordpress.sql.gz"
[[ -s "$BACKUP_DIR/wordpress.sql.gz" ]]

echo "Backing up wp_data..."
docker compose exec -T wordpress tar czf - -C /var/www/html . > "$BACKUP_DIR/wp_data.tar.gz"
[[ -s "$BACKUP_DIR/wp_data.tar.gz" ]]

echo "Backing up secrets..."
docker compose exec -T web tar czf - -C /run/secrets . > "$BACKUP_DIR/secrets.tar.gz"
[[ -s "$BACKUP_DIR/secrets.tar.gz" ]]

if [[ -f .env ]]; then
  cp .env "$BACKUP_DIR/env"
  chmod 600 "$BACKUP_DIR/env"
else
  echo "Warning: .env not found, skipping."
fi

echo "Writing checksums..."
(
  cd "$BACKUP_DIR"
  sha256sum postgres.sql.gz wordpress.sql.gz wp_data.tar.gz secrets.tar.gz > SHA256SUMS
  if [[ -f env ]]; then
    sha256sum env >> SHA256SUMS
  fi
)

echo "Deleting backups older than $RETENTION_DAYS days..."
if ! find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d -mtime +"$RETENTION_DAYS" -exec rm -rf {} +; then
  echo "Warning: could not prune all old backups."
fi

echo "Backup written to $BACKUP_DIR"
