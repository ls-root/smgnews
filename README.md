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

## Deployment Guide
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
