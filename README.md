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
- Run on Host machine `build-standalone.sh`
- Copy `smgnews-portable.tar.gz` to server
- Extract to `/opt/smgnews`
```sh
tar xzvf smgnews-portable.tar.gz -C /opt/smgnews
```
- Create `/etc/systemd/system/smgnews.service`
```service
[Unit]
Description=SMGNews server
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/smgnews
ExecStart=/usr/bin/node server.js
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```
- Enable `smgnews`
- Start `smgnews`
- Add `smgnews.conf` in `/etc/apache2/sites-available`
```xml
<VirtualHost *:80>
    ServerName www.example.com

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Forwarded-Port "80"

    ErrorLog ${APACHE_LOG_DIR}/smgnews-error.log
    CustomLog ${APACHE_LOG_DIR}/smgnews-access.log combined
</VirtualHost>
```
> [!CAUTION]
> replace `www.example.com` with your real subdomain.
- Enable `smgnews.conf` via `a2ensite`
- Enable `proxy`, `proxy_http` and `headers` via `a2enmod`
- Restart `apache2`
