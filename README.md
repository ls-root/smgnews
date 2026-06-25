# SMGNews

## Wordpress Setup
- Members WP Plugin for user managmend
- comments user
  - premissions
    - deny all, expect moderate comments && list users && edit users
  - application password
- groups
  - "inactive" does nothing

## WP renderer
not all wp blocks are implemented yet.
Here is a list of all blocks / block groups that are not implemented yet or never will be.
- Read more
- HR gradients. They are borken in the Gutenberg editor so they aren't implemented
- Widgets (group) (13 blocks)
- Theme (group) (34 blocks) (not relevant for articles)

## Deployment Guide (Docker edition)
Tested on Debian 13 Trixie.
- Install `docker` and the `docker-compose` plugin.
  - Update repositories
  - Install `ca-certificates` and `curl`
  - Create directory `/etc/apt/keyrings` with `755` premisson
    ```bash
    install -m 0755 -d /etc/apt/keyrings
    ```
  - Get the docker GPG key and copy it to `/etc/apt/keyrings/docker.asc`
    ```bash
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
    ```
  - Add read premisson to all users to the certificate
    ```bash
    chmod a+r /etc/apt/keyrings/docker.asc
    ```
  - Add the docker APT repository to `/etc/apt/sources.list.d/docker.sources`
    ```sources
    Types: deb
    URIs: https://download.docker.com/linux/debian
    Suites: <CODENAME>
    Components: stable
    Signed-By: /etc/apt/keyrings/docker.asc
    ```
    replace `<CODENAME>` with the distors codename. Found in `/etc/os-release`
  - Update repositories
  - Install Dokcer packages `docker-ce`, `docker-ce-cli`, `containerd.io`, `docker-buildx-plugin` and `docker-compose-plugin`
- Clone SMGNews
  - Install `git`
  - Clone SMGNews from `https://github.com/ls-root/smgnews.git`
- Build SMGNews docker
  ```bash
  sudo docker build --build-arg NEXT_PUBLIC_WP_REST_ENDPOINT=https://caddy:8080/wp-json/wp/v2 -t smgnews .
  ```
- Configure DNS (domain) (example)
  | Type | Name | IPv4 |
  | ------------- | -------------- | -------------- |
  | A | www.hostname.tld | <YOUR_SERVER_IP> |
  | A | wp.hostname.tld | <YOUR_SERVER_IP> |
  | A | docs.hostname.tld | <YOUR_SERVER_IP> |
- Configure Caddy 
  ```Caddyfile
  {
    email <ADMIN_EMAIL>
  }

  <MAIN_DOMAIN> {
    reverse_proxy web:3000
  }

  <WP_SUBDOMAIN>, https://caddy:8080/ {
    reverse_proxy wordpress:80 {
      header_up Host {http.request.host}
      header_up X-Forwarded-Proto {http.request.scheme}
      header_up X-Forwarded-Ssl on
      header_up Authorization {http.request.header.Authorization}
    }
  }

  <DOCS_SUBDOMAIN> {
    reverse_proxy docs:80
  }
  ```
  Replace `<ADMIN_EMAIL>`, `<MAIN_DOMAIN>` and `<WP_SUBDOMAIN>`.
  > [!CAUTION]
  > Don't specify the protocol in the domain you enter in the Caddyfile
- Configure WordPress
  - Activate `Poll Manager` plugin
  - In `Poll Manager` settings set the API Root to `http://web:3000/api` and set the password
  - Change the Permalink structure to something that **IS NOT TO PLAIN**
  - Install `Members WP` plugin by Blair Williams (or any other Role editing plugin)
  - Add a role called `comments` deny everything except:
    - Moderate Comments
    - List Users
    - Edit Users
  - Add a user called `comments` with **ONLY** `comments` role.
  - Create an application password for `comments`
- Configure `.env`
  create `.env` file where your `docker-compose.yml` is located.
- Build the Docs
  - Clone the Docs from `https://github.com/ls-root/smgnews-docs.git`
  - Build them
    ```bash
    docker build -t smgnews-docs .
    ```
- Modify SMGNews redirect `base_target` in `smgnews-redirect/functions.php`

## Deployment Guide (Bare-metal edition)
Does use a bit of docker for the frontend.
Tested on Debian 13 Trixie.

- Update package list
- Install `apache2`
- Enable `apache2`
- Start `apache2`
- Install `ufw`
- `ufw` allow 22/tcp
- `ufw` allow 80/tcp
- `ufw` allow 443/tcp
- enable `ufw`
- Install `mariadb-server`
- Log into the DB via `mysql`
- Change password
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;   
```
- Install `php` and `php-mysql`
- Restart `apache2`
- Log into the DB via `mysql`
- Configure DB for WordPress
```sql
CREATE DATABASE wordpress DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'wp_password';
GRANT ALL ON wordpress.* TO 'wpuser'@'localhost';
FLUSH PRIVILEGES;
```
- Download latest WordPress relase from `https://wordpress.org/latest.tar.gz`
- Extract tarball
- Clean `/var/www/html`
- Copy WordPress to `/var/www/html/wordpress`
- Set ownership of `/var/www/html` to `www-data`
```sh
chown -R www-data:www-data /var/www/html
```
- Enable `rewrite` and `alias` module via `a2enmod`
- Restart `apache2`
- Disable `000-default.conf`
```sh
a2dissite 000-default
```
- Add `wordpress.conf` in `/etc/apache2/sites-available`
```xml
<VirtualHost *:80>
    ServerName wp.example.com
    DocumentRoot /var/www/html/wordpress

    <Directory /var/www/html/wordpress>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/wp-error.log
    CustomLog ${APACHE_LOG_DIR}/wp-access.log combined
</VirtualHost>
```
> [!CAUTION]
> replace `wp.example.com` with your real subdomain.
- Enable `wordpress.conf` via `a2ensite`
- Restart `apache2`
- Configure wordpress
  - Change the Permalink structure to something that is not **plain**
  - Install `Members WP` plugin by Blair Williams (or any other Role editing plugin)
  - Add a role called `comments` deny everything except:
    - Moderate Comments
    - List Users
    - Edit Users
  - Add a user called `comments` with **ONLY** `comments` role.
  - Create an application password for `comments`
- Download latest [`smgnews-docs`](https://github.com/ls-root/smgnews-docs/releases/) release (`dist.tar.gz`)
- Extract tarball to `/var/www/html/docs`
- Add `docs.conf` in `/etc/apache2/sites-available`
```xml
<VirtualHost *:80>
    ServerName docs.example.com
    DocumentRoot /var/www/html/docs
    ErrorDocument 404 /404.html 

    <Directory /var/www/html/docs>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/static-error.log
    CustomLog ${APACHE_LOG_DIR}/static-access.log combined
</VirtualHost>
```
> [!CAUTION]
> replace `docs.example.com` with your real subdomain.
- Enable `docs.conf` via `a2ensite`
- Restart `apache2`
- Install `certbot` and `python3-certbot-apache`
- Run `sudo certbot --apache -d wp.example.com -d docs.example.com`
- Install docker
```sh
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```
- Install `docker-ce`, `docker-ce-cli`, `containerd.io`, `docker-buildx-plugin` and `docker-compose-plugin`
- Install `postgresql` and `postgresql-client`
- Switch to `postgres` user
- Run `psql`
```sql
CREATE USER smgnews WITH PASSWORD 'password';
CREATE DATABASE smgnews;

\c smgnews
GRANT USAGE ON SCHEMA public TO smgnews;
GRANT CREATE ON SCHEMA public TO smgnews;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO smgnews;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO smgnews;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO smgnews;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO smgnews;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO smgnews;

```
- Connect to PostgreSQL using new user
```sh
psql -U smgnews -h localhost
```
- Set `listen_addresses` in `/etc/postgresql/*/main/postgresql.conf` to `*`
- Add to `/etc/postgresql/*/main/pg_hba.conf`
```conf
# Allow Docker containers to connect
host    all             all             172.16.0.0/12         md5
```
- Restart `postgresql`
- Build smgnews on host
```sh
sudo docker build --build-arg NEXT_PUBLIC_WP_REST_ENDPOINT=http://wp.example.com/wp-json/wp/v2 -t smgnews .
```
> [!CAUTION]
> replace `wp.example.com` with your real subdomain.
- Export docker image
- Transfer to server
- Load image
- Create `docker-compose.yml`
```yml
services:
  web:
    image: smgnews
    container_name: smgnews-web
    env_file:
      - .env
    ports: 
      - "3000:3000"
    extra_hosts:
      - "host.docker.internal:host-gateway"
    restart: unless-stopped
```
- Create `.env` file
```
NEXT_PUBLIC_WP_REST_ENDPOINT=
DATABASE_URL=
WP_COMMENTS_USERNAME=
WP_COMMENTS_APPLICATION_PASSWORD=
OPENWEATHERMAP_API_KEY=
JWT_SECRET=
API_ADMIN_BCRYPT_HASH=
```
Database url schema: `postgres://<user>:<password>@host.docker.internal:5432/<database>`
For the amdin api bcrypt hash use `utils/hash.ts`
- Enable `proxy` and `proxy_http` modules for apache.
- Add `smgnews.conf` in `/etc/apache2/sites-available`.
```xml
<VirtualHost *:80>
    ServerName example.com

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/smgnews_error.log
    CustomLog ${APACHE_LOG_DIR}/smgnews_access.log combined
</VirtualHost>
```
- Enable site
- Restart `apache2`
- Allow connections to PostgreSQL from Docker subnet
```
sudo ufw allow from 172.16.0.0/12 to any port 5432
```
- Start docker compose.
- Re-run certbot with new domain and all previous ones.
- Download `poll-manager.zip` from the latest github release of smgnews.
- In wordpress go to Plugins > Add Plugin > Upload Plugin and upload `poll-manager.zip`.
- Go to Umfragen > Einstellungen and set `API Endpunkt Addrese` and `API Passwort` accordingly.
- Download `smgnews-redirect.zip` from the latest github release of smgnews.
- In wordpress go to Apprence > Themes > Add THeme > Upload Theme and upload `smgnews-redirect.zip`.
- In `/var/www/html/wordpress/wp-content/themes/smgnews-redirect/functions.php` set `base_url` to your site URL
