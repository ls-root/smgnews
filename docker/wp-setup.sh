#!/bin/sh
# Entrypoint for the WordPress container.
#
# Installs and configures WordPress
#
# This service is also the secret authority: it generates all secrets as
# files into the shared `secrets` volume (/run/secrets)

set -eu

MAX_TRIES=60
SECRETS_DIR=/run/secrets
APP_PASSWORD_NAME="smgnews-docker"

log() { echo "[wp-setup] $*"; }

wp() { command wp --allow-root "$@"; }

hex_secret() { php -r 'echo bin2hex(random_bytes(32));'; }

# generate secrets
mkdir -p "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR" 2>/dev/null || true

for secret in jwt_secret api_admin_password; do
  if [ ! -s "$SECRETS_DIR/$secret" ]; then
    hex_secret > "$SECRETS_DIR/$secret"
    chmod 600 "$SECRETS_DIR/$secret"
    log "Generated $secret."
  fi
done

API_PASSWORD_VALUE="$(cat "$SECRETS_DIR/api_admin_password")"

log "Waiting for WordPress files..."
tries=0
until [ -f /var/www/html/wp-config.php ]; do
  tries=$((tries + 1))
  if [ "$tries" -ge "$MAX_TRIES" ]; then
    log "ERROR: wp-config.php not found after $MAX_TRIES attempts."
    exit 1
  fi
  sleep 2
done

log "Waiting for the database..."
tries=0
until php -r 'try { new mysqli(getenv("WORDPRESS_DB_HOST"), getenv("WORDPRESS_DB_USER"), getenv("WORDPRESS_DB_PASSWORD"), getenv("WORDPRESS_DB_NAME")); } catch (Throwable $e) { exit(1); }' >/dev/null 2>&1; do
  tries=$((tries + 1))
  if [ "$tries" -ge "$MAX_TRIES" ]; then
    log "ERROR: database not reachable after $MAX_TRIES attempts."
    exit 1
  fi
  sleep 2
done

# core install (skipped if WordPress is already installed)
WP_URL_VAL="${WP_HOME:-http://localhost:8080}"

if wp core is-installed >/dev/null 2>&1; then
  log "WordPress is already installed, applying configuration."
else
  log "Installing WordPress core..."
  wp core install \
    --url="$WP_URL_VAL" \
    --title="SMGNews" \
    --admin_user="${WP_ADMIN_USER:-admin}" \
    --admin_password="${WP_ADMIN_PASSWORD:-changeme}" \
    --admin_email="${WP_ADMIN_EMAIL:-admin@local.host}" \
    --skip-email
fi

wp option update siteurl "$WP_URL_VAL" >/dev/null
wp option update home "$WP_URL_VAL" >/dev/null

wp rewrite structure '/%postname%/' >/dev/null
wp rewrite flush --hard >/dev/null 2>&1 || true

wp theme activate smgnews-redirect 2>/dev/null ||
  log "WARNING: could not activate the smgnews-redirect theme"

wp plugin activate poll-manager 2>/dev/null ||
  log "WARNING: could not activate the poll-manager plugin"

# comments user
wp role create comments Comments >/dev/null 2>&1 || true
wp cap add comments moderate_comments list_users edit_users >/dev/null 2>&1 || true

WP_COMMENTS_USER="${WP_COMMENTS_USERNAME:-comments}"
if ! wp user get "$WP_COMMENTS_USER" >/dev/null 2>&1; then
  wp user create "$WP_COMMENTS_USER" \
    "${WP_COMMENTS_EMAIL:-comments@local.host}" \
    --role=comments >/dev/null
  log "Created the comments user."
fi

# generate application password
APP_PW_FILE="$SECRETS_DIR/wp_comments_application_password"
APP_PW_UUID="$(wp user application-password list "$WP_COMMENTS_USER" \
  --format=csv --fields=UUID,name 2>/dev/null |
  awk -F, -v n="$APP_PASSWORD_NAME" '$2 == n { print $1 }')"

if [ -n "$APP_PW_UUID" ] && [ -s "$APP_PW_FILE" ]; then
  log "Application password already present."
else
  if [ -n "$APP_PW_UUID" ]; then
    wp user application-password delete "$WP_COMMENTS_USER" "$APP_PW_UUID" >/dev/null 2>&1 || true
  fi
  wp user application-password create "$WP_COMMENTS_USER" "$APP_PASSWORD_NAME" --porcelain > "$APP_PW_FILE"
  chmod 600 "$APP_PW_FILE"
  log "Application password generated and stored in the secrets volume."
fi

PM_API_PASSWORD="$API_PASSWORD_VALUE" wp eval 'update_option("poll_manager_settings", [
  "api_root"     => getenv("POLL_MANAGER_API_ROOT") ?: "http://web:3000/api",
  "api_password" => getenv("PM_API_PASSWORD") ?: "",
]);' && log "Poll Manager settings configured."

log "WordPress setup complete."
