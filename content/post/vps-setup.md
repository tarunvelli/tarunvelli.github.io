---
title: "VPS setup"
tags: [
    "openvpn",
    "pihole",
    "transmission",
    "bittorrent",
    "filebrowser",
    "self-hosting",
    "nginx"
]
date: "2023-07-22"
summary: "Setup for my VPS instance that I use for VPN / Torrents. Documenting it so that I can re-setup if it gets wrecked."
---

# Initial server setup

Before installing specific software it's recomended to perform some initial server setup steps like user and firewall setup to ensure a secure environment.

- [Detailed steps](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-22-04)

# Vim

The server might come with Nano for text editing, but as everyone knows Vim is the best text editor.

```
sudo apt update
sudo apt -y install vim
```

# Oh My Zsh

The out of the box command-line experience is boring. Oh My Zsh is a shell framework that enhances it.

```
sudo apt -y install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

- [Oxide theme](https://github.com/ohmyzsh/ohmyzsh/wiki/External-themes#oxide)

```
cd ~/.oh-my-zsh/themes
curl -O https://raw.githubusercontent.com/dikiaap/dotfiles/master/.oh-my-zsh/themes/oxide.zsh-theme
```

open .zshrc in vim and change theme to oxide

# VPN + Pi-hole

Steps for setting up a VPN with built-in adblocking using Wireguard and Pi-hole

```
curl -L https://install.pivpn.io | bash
```

- [Detailed steps](https://docs.pivpn.io/install/)

# Transmission

Torrent client on the server ♥

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
"rpc-whitelist-enabled": false,
"umask": 2,
```

- Restart

```
sudo service transmission-daemon start
```

- [Detailed steps](https://help.ubuntu.com/community/TransmissionHowTo)

# Filebrowser

Manage and view files on your server through a web interface

```
curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash
filebrowser -r /path/to/your/files
```

Create service file

```
mkdir -p ~/.config/systemd/user
sudo vim /etc/systemd/system/filebrowser.service
```

Define service

```
[Unit]
Description=File Browser Service
After=network.target

[Service]
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=filebrowser -r /var/lib/transmission-daemon/downloads/

[Install]
WantedBy=multi-user.target
```

Run service

```
sudo systemctl start filebrowser.service
sudo systemctl enable filebrowser.service
```

- [Detailed steps](https://filebrowser.org/installation)

# Sterling PDF

Web based PDF editor so that I can manage PDFs from anywhere

[Install docker & docker compose](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)

Create a directory and a compose.yml file within it

```
cd ~
mkdir stirling-pdf
cd stirling-pdf
vim compose.yml
```

Paste the below into the docker compose file

```
version: '3.3'
services:
  stirling-pdf:
    image: frooodle/s-pdf:latest
    ports:
      - '8080:8080'
    volumes:
      - /location/of/trainingData:/usr/share/tessdata #Required for extra OCR languages
      - /location/of/extraConfigs:/configs
#      - /location/of/customFiles:/customFiles/
#      - /location/of/logs:/logs/
    environment:
      - DOCKER_ENABLE_SECURITY=false
      - INSTALL_BOOK_AND_ADVANCED_HTML_OPS=false
      - LANGS=en_GB
```

Run docker compose up in detached mode

```
sudo docker compose up -d
```

- [Detailed steps](https://github.com/Stirling-Tools/Stirling-PDF?tab=readme-ov-file#how-to-use)

# Nginx

Use Nginx as a reverse proxy to map subdomains to ports

- Install nginx

```
sudo apt update
sudo apt -y install nginx
```

- Allow through firewall

```
sudo ufw allow 'Nginx Full'
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

Like a vacine against hackers. Secure your website with free TLS/SSL certificates from Let's Encrypt.

- Install certbot

```
sudo apt install certbot python3-certbot-nginx
```

- Obtaining SSL cert

```
sudo certbot --nginx -d example.com -d www.example.com
```

- [Detailed steps](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04)
