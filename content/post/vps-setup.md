---
title: "VPS setup"
description: ""
tags: [
    "openvpn",
    "pihole",
    "transmission",
    "bittorrent",
    "filebrowser"
]
date: "2023-07-22"
summary: "Setup for my VPS instance that I use for VPN / Torrents. Documenting it so that I can re-setup if it gets wrecked."
---

# Initial server setup

- Steps to take to setup user and firewall on a new server instance

- [Detailed steps](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-22-04)

# Vim

- Better than nano

```
sudo apt update
sudo apt -y install vim
```

# Oh My Zsh

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

- [Oxide theme](https://github.com/ohmyzsh/ohmyzsh/wiki/External-themes#oxide)

# Nginx

- To map subdomains to ports

- Install nginx

```
sudo apt update
sudo apt install nginx
```

- Allow through firewall

```
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'
```

-  Server block without TLS/SSL

```
server {
    listen 80;
    listen [::]:80;

    server_name <subdomain.domain.tld>;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         "http://127.0.0.1:<port>";
    }
}
```

- After running certbot

```
server {
    server_name <subdomain.domain.tld>;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         "http://127.0.0.1:<port>";
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/<subdomain.domain.tld>/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/<subdomain.domain.tld>/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = <subdomain.domain.tld>) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name <subdomain.domain.tld>;
    return 404; # managed by Certbot
}
```

- [Detailed steps](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04)

# Lets Encrypt

- Free TLS/SSL certificates

- Install certbot

```
sudo apt install certbot python3-certbot-nginx
```

- Obtaining SSL cert

```
sudo certbot --nginx -d example.com -d www.example.com
```

- [Detailed steps](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04)

# OpenVPN + Pi-hole

- VPN with built in adblocker

- [Detailed steps](https://docs.pi-hole.net/guides/vpn/openvpn/installation/)

# Transmission

- Torrents ♥

- Install

```
sudo add-apt-repository ppa:transmissionbt/ppa
sudo apt-get update
sudo apt-get install transmission-cli transmission-common transmission-daemon
```

- Configure

```
sudo service transmission-daemon stop
sudo vim /var/lib/transmission-daemon/info/settings.json
```

- Change the following

```
"rpc-password": "<new password>",
"rpc-username": "<new username>",
"rpc-whitelist": "127.0.0.1,192.168.*.*",
"umask": 2,
```

- Restart

```
sudo service transmission-daemon start
```

- [Detailed steps](https://help.ubuntu.com/community/TransmissionHowTo)

# Filebrowser

- View files on the server via browser

```
curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash
filebrowser -r /path/to/your/files
```

- [Detailed steps](https://filebrowser.org/installation)
