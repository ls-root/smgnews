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
  - "inactive" does nothing

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
```bash
docker compose up -d --build
```
The `wp-setup` service now generates all secrets, installs WordPress, activates `poll-manager` + the redirect theme, creates the `comments` role/user and application password, and configures Poll Manager. The frontend waits for it to finish before starting. Watch it with:
```bash
docker compose logs -f wp-setup
```
### 5. Reverse Proxy
Now the full SMGNews stack is running on your server. In order to see the site on your domain you need some type of reverse proxy that routes the requests. Here is a simple example using the default ports and [caddy](https://caddyserver.com/):
```Caddyfile
news.example.com {
	reverse_proxy :3000
}

wp.news.example.com {
	reverse_proxy :8080
}
```

### 6. Updating later
```bash
cd /opt/smgnews
git pull
docker compose up -d --build
```
If you changed anything in `.env` (URLs, passwords), re-apply the WordPress config:
```bash
docker compose run --rm wp-setup
```

### 9. Backups
The state lives in four docker volumes: `pg_data` (polls/stars/ratings), `mariadb_data` (WordPress DB), `wp_data` (uploads/plugins) and `secrets` (auto-generated credentials). Snapshot them regularly, e.g.:
```bash
docker run --rm -v smgnews_pg_data:/data -v /root/backups:/backup alpine \
  tar czf /backup/pg-$(date +%F).tar.gz -C /data .
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
