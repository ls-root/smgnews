# SMGNews

## Wordpress Setup
Automated by the `wp-setup` service (see [Deployment](#deploying-on-a-server-walkthrough)):
- comments role
  - created via the WP core roles API through WP-CLI (`wp role create` + `wp cap add`)
  - premissions
    - deny all, expect moderate comments && list users && edit users
- comments user
  - application password (auto-generated into the `secrets` volume)
- groups
  - `inactive` (display name "Inaktiv") does nothing, flags former members
  - `klasse_<suffix>` (display name "Klasse <suffix>") groups authors on `/team`

## WP renderer
not all wp blocks are implemented yet.
Here is a list of all blocks / block groups that are not implemented yet or never will be.
- Read more
- HR gradients. They are borken in the Gutenberg editor so they aren't implemented
- Widgets (group) (13 blocks)
- Theme (group) (34 blocks) (not relevant for articles)

## Deploying on a Server (Walkthrough)
An end-to-end example of what a deployment looks like, from a fresh server to a running site.

Assumed setup for this walkthrough:
- A Debian based server with root access
- Two domains pointing to the server (A records):
  | Type | Name | Points to |
  | ---- | ------------------- | ---------------- |
  | A | news.example.com | <YOUR_SERVER_IP> |
  | A | wp.news.example.com | <YOUR_SERVER_IP> |
- `news.example.com` is the public frontend, `wp.news.example.com` is WordPress.

### 1. Install Docker
```bash
curl -fsSL https://get.docker.com | sh
```

### 2. Get the code
```bash
apt install git
git clone https://github.com/ls-root/smgnews.git /opt/smgnews
cd /opt/smgnews
```

### 3. Configure `.env`
```bash
cp .env.example .env
nano .env
```
Fill out the fields in the `.env` file. It is well documented.
### 4. Start the stack
If you are restoring from a backup (on a new server or over an existing installation), skip this step and follow [Restoring](#restoring) instead.
```bash
docker compose up -d --build
```
The `migrate` service applies pending PostgreSQL migrations, then `wp-setup` generates all secrets, installs WordPress, activates `poll-manager` + the redirect theme, creates the `comments` role/user and application password, ensures the `inactive` + `klasse_*` team roles (see `KLASSE_ROLES` in `.env`), and configures Poll Manager. The frontend waits for both to finish before starting. Watch them with:
```bash
docker compose logs -f migrate wp-setup
```
### 5. Reverse Proxy
Now the full SMGNews stack is running on your server. In order to see the site on your domain you need some type of reverse proxy that routes the requests. The published ports are bound to `127.0.0.1` only, so the proxy must run on the host and connect to the loopback address. Here is a simple example using the default ports and [caddy](https://caddyserver.com/):
```Caddyfile
news.example.com {
	reverse_proxy 127.0.0.1:3000
}

wp.news.example.com {
	reverse_proxy 127.0.0.1:8080
}
```

### 6. Updating later
Take a backup before updating (see [Backups](#backups)):
```bash
cd /opt/smgnews
sudo ./backup.sh
git pull
docker compose up -d --build
```
Pending database migrations are applied by the `migrate` service before the frontend restarts.
If you changed anything in `.env` (URLs, passwords), re-apply the WordPress config:
```bash
docker compose run --rm wp-setup
```

## Secrets & Rotation
All secrets are generated automatically on first start (by the `wp-setup` service) and stored as files in the `secrets` docker volume.

| Secret file | Injected as (web container) | Purpose |
| ----------- | --------------------------- | ------- |
| `jwt_secret` | `JWT_SECRET` | Signs and verifies API JWTs |
| `api_admin_password` | `API_ADMIN_PASSWORD` | Admin API password (`/api/login`), also used by the Poll Manager plugin |
| `wp_comments_application_password` | `WP_COMMENTS_APPLICATION_PASSWORD` | WordPress application password for posting comments |

Inspect them:
```bash
docker compose run --rm --entrypoint sh wp-setup -c 'ls -l /run/secrets'
```
Rotate them (e.g. after a suspected leak):
```bash
docker compose run --rm --entrypoint sh wp-setup -c 'rm -f /run/secrets/*'
docker compose run --rm wp-setup            # regenerate secrets + re-apply WP config
docker compose up -d --force-recreate web   # restart the frontend with the new secrets
```

## Backups

The stack keeps its state in four Docker volumes and one file:

| Data | Location | Contents |
| ---- | -------- | -------- |
| PostgreSQL | `smgnews_pg_data` | polls, votes/stars and ratings |
| MariaDB | `smgnews_mariadb_data` | WordPress database |
| WordPress files | `smgnews_wp_data` | WP core, `wp-config.php`, uploads, plugins and themes |
| Secrets | `smgnews_secrets` | JWT secret, admin API password, comments application password |
| Configuration | `/opt/smgnews/.env` | database passwords, WP admin password, API keys, public URLs |

`backup.sh` in the repository root creates a backup of all of it. It must be run from the repository root while the stack is running.

Each run creates a directory at `/var/backups/smgnews/<DD-MM-YY>` (with `-1`, `-2`, … appended for additional runs on the same day) containing backups of each service listed above and a file with sha256 checksums for each file.

The backups are written with `umask 077` and the backup root is set to mode `700`. They contain plaintext credentials (database passwords, the WordPress admin password and the application password), so treat them as secrets.

If `.env` is missing, the script prints a warning and leaves `env` out of the backup. In that case, keep the deployment's environment variables backed up separately.

### Running a backup manually

```bash
cd /opt/smgnews
chmod +x backup.sh
sudo ./backup.sh
```

The script:

1. Creates the dated backup directory.
2. Dumps PostgreSQL with `pg_dumpall`, MariaDB with `mariadb-dump --single-transaction`, and archives `wp_data` and `secrets`.
3. Copies `.env` and writes `SHA256SUMS`.
4. Deletes backup directories older than `RETENTION_DAYS` days (default 14), based on directory modification time.

### `backup.sh` Configuration

The script reads these environment variables:

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `BACKUP_ROOT` | `/var/backups/smgnews` | destination directory |
| `RETENTION_DAYS` | `14` | delete backup directories older than this many days |
| `LOCKDIR` | `/run/lock/smgnews-backup.lock` | PID lock directory |

### Scheduling

A systemd timer is the recommended if working on a systemd system. Cron works too, but systemd gives you journal logging, catch-up after downtime and a timeout you can control.

#### Systemd
Create `/etc/smgnews/backup.env`:

```ini
BACKUP_ROOT=/var/backups/smgnews
RETENTION_DAYS=14
```

Create `/etc/systemd/system/smgnews-backup.service`:

```ini
[Unit]
Description=SMGNews backup
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
User=root
WorkingDirectory=/opt/smgnews
EnvironmentFile=-/etc/smgnews/backup.env
ExecStart=/opt/smgnews/backup.sh
TimeoutStartSec=0
Nice=10
IOSchedulingClass=idle
```

Create `/etc/systemd/system/smgnews-backup.timer`:

```ini
[Unit]
Description=Daily SMGNews backup

[Timer]
OnCalendar=*-*-* 03:15:00
Persistent=true
RandomizedDelaySec=15m
Unit=smgnews-backup.service

[Install]
WantedBy=timers.target
```

This will run the backup unit every day on 3:15 AM

#### Cron
With cron, put this in `/etc/cron.d/smgnews-backup` instead:

```cron
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
15 3 * * * root cd /opt/smgnews && ./backup.sh >> /var/log/smgnews-backup.log 2>&1
```

### Verifying a backup

Always verify before relying on a backup:

```bash
export BACKUP=/var/backups/smgnews/30-10-26

(cd "$BACKUP" && sha256sum -c SHA256SUMS)
gzip -t "$BACKUP/wordpress.sql.gz"
zcat "$BACKUP/postgres.sql.gz" | head
tar tzf "$BACKUP/wp_data.tar.gz" | head
tar tzf "$BACKUP/secrets.tar.gz"
```

A directory without `SHA256SUMS` is incomplete and must not be used.

### Restoring

This procedure replaces **all** state in the four volumes. It works both for a fresh installation from a backup and for restoring over an existing installation. On an existing installation, take a fresh backup first, because step 2 deletes the current volumes.

On a new server, install Docker and clone the repository as described in the [deployment walkthrough](#deploying-on-a-server-walkthrough), then copy the backup directory to `/var/backups/smgnews/`. There is no need to create `.env` or start the stack first.

Do a real restore drill at least once a quarter.

Run everything as root from `/opt/smgnews`:

```bash
cd /opt/smgnews
export BACKUP=/var/backups/smgnews/30-10-26
```

1. Verify the backup:

```bash
(cd "$BACKUP" && sha256sum -c SHA256SUMS)
```

2. Stop the stack and remove its volumes.

```bash
docker compose down -v
```

3. Restore `.env`.

```bash
install -m 600 "$BACKUP/env" .env
```

4. Start the databases.

```bash
docker compose up -d --wait postgres mariadb
```

5. Restore PostgreSQL. `postgres.sql.gz` is plain `pg_dumpall` output, so use `psql`:

```bash
zcat "$BACKUP/postgres.sql.gz" | docker compose exec -T postgres psql -U postgres -d postgres
```

6. Restore MariaDB. The fresh MariaDB volume already contains the `wordpress` database and the user from the restored `.env`

```bash
zcat "$BACKUP/wordpress.sql.gz" | docker compose exec -T mariadb sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mariadb -u "$MYSQL_USER" "$MYSQL_DATABASE"'
```

7. Restore the WordPress files and secrets volumes.

```bash
docker volume create smgnews_wp_data
docker run --rm \
  -v smgnews_wp_data:/data \
  -v "$BACKUP":/backup:ro \
  alpine sh -c 'find /data -mindepth 1 -maxdepth 1 -exec rm -rf {} + && tar xzf /backup/wp_data.tar.gz -C /data && chown -R 33:33 /data'

docker volume create smgnews_secrets
docker run --rm \
  -v smgnews_secrets:/data \
  -v "$BACKUP":/backup:ro \
  alpine sh -c 'find /data -mindepth 1 -maxdepth 1 -exec rm -rf {} + && tar xzf /backup/secrets.tar.gz -C /data'
```

8. Start the rest of the stack:

```bash
docker compose up -d --build
docker compose logs -f migrate wp-setup
```
