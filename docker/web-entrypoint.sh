#!/bin/sh
# Entrypoint for the web (next.js standalone) container.
#
# Injects secrets as env vars

set -eu

SECRETS_DIR=/run/secrets
MAX_TRIES=150 # 5 minutes

export_secret() {
  file="$1"
  name="$2"
  tries=0
  until [ -s "$SECRETS_DIR/$file" ]; do
    tries=$((tries + 1))
    if [ "$tries" -ge "$MAX_TRIES" ]; then
      echo "ERROR: $SECRETS_DIR/$file not found after 5 minutes." >&2
      echo "The wp-setup service must run first" >&2
      exit 1
    fi
    sleep 2
  done
  export "$name=$(cat "$SECRETS_DIR/$file")"
}

export_secret jwt_secret JWT_SECRET
export_secret api_admin_password API_ADMIN_PASSWORD
export_secret wp_comments_application_password WP_COMMENTS_APPLICATION_PASSWORD

exec "$@"
