---
title: "Self-Hosting Ollama"
tags: [
    "ollama",
    "self-hosting",
    "llm",
    "nginx"
]
date: "2024-06-16"
summary: "How to install and run Ollama from a self-hosted server or VPS"
---

# What I'll be doing in this guide

Ollama is an open-source app to run and customize large language models.

This is a step-by-step guide on how to install and run Ollama on a self-hosted server or VPS with Nginx. I've used an Ubuntu droplet from DigitalOcean, but this can be adapted to pretty much any server environment. This setup is mainly for experimenting and might not be suitable for production applications.

Using GPU machines is preferred, and I tried setting up a GPU droplet using DigitalOcean's [Paperspace](https://www.paperspace.com/) product. I was running into issues with Paperspace to set up the GPU droplet. I needed to request approval and I was also running into an error when trying to access its billing integration page with DigitalOcean. So I decided to use a CPU machine while writing this guide as it was easier to set up and experiment with. Also, it didn't hurt that it's cheaper.

![paperspace-approval-request](/assets/ollama/paperspace-approval-required.png##center)

I've set up the DigitalOcean droplet in the closest region to my users (just myself for this guide), using the Ubuntu 24.04 image, which is the latest LTS at the time of writing, with a dedicated general-purpose CPU and I've selected an SSH key as the authentication method.

# Why would you want to try this

I don't intend to convince anyone that self-hosting an LLM is better than using third-party services. This is just to enable developers so that they can experiment with self-hosting and evaluate it for themselves.

Some parameters to evaluate would be pricing, security, and the ability to customize the models. With self-hosting, we can have a flat rate per month instead of token usage-based pricing. The onus of securing the server lies with the developer. I've picked Ollama as it allows [customizing models](https://github.com/ollama/ollama?tab=readme-ov-file#customize-a-model).

# How to self-host an LLM using Ollama

## Install and set up Ollama

After creating the droplet, access it from your terminal by SSH:

```
ssh root@<ip address>
```

I always install vim first as I prefer it over nano:

```
sudo apt update
sudo apt -y install vim
```

Install Ollama using the one-liner; this installs Ollama and starts a systemd service:

```
curl -fsSL https://ollama.com/install.sh | sh
```

[Ollama has additional instructions](https://github.com/ollama/ollama/blob/main/docs/linux.md) for manual installation or using it with GPUs.

Pull the required model. I've used llama3 here:

```
ollama pull llama3
```

Test the REST API by querying localhost:

```
curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "prompt":"Why is the sky blue?"
}'
```

## Install and set up Nginx

To make the API accessible from external machines, we can use Nginx as a reverse proxy and also to set up basic auth.

Install Nginx and apache2-utils:

```
sudo apt update
sudo apt -y install nginx apache2-utils
```

Create a user (ollama_user), then specify and confirm a password:

```
sudo htpasswd -c /etc/nginx/.htpasswd ollama_user
```

Edit the default Nginx config file:

```
sudo vim /etc/nginx/sites-available/default
```

Enter the below configuration:

```
server {
    listen 80;
    listen [::]:80;

    server_name _;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         "http://127.0.0.1:11434";

        auth_basic "Restricted Content";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

Remove the existing default file in sites-enabled (if present) and replace it with a soft link to sites-available:

```
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
```

Reload Nginx:

```
sudo service nginx reload
```

Now the API is accessible from an external machine:

```
curl -u ollama_user:<password> http://<ip address>/api/generate -d '{
  "model": "llama3",
  "prompt":"Why is the sky blue?"
}'
```

When generating a response with `"stream": false`, large responses can time out Nginx. To resolve this, we can increase the timeout period in Nginx.

Open the config:

```
sudo vim /etc/nginx/sites-available/default
```

and update it to below to increase the timeout to 500 seconds:

```
server {
    listen 80;
    listen [::]:80;

    server_name _;

    location / {
        proxy_set_header   X-Forwarded-For $remote_addr;
        proxy_set_header   Host $http_host;
        proxy_pass         "http://127.0.0.1:11434";

        proxy_connect_timeout       500;
        proxy_send_timeout          500;
        proxy_read_timeout          500;
        send_timeout                500;

        auth_basic "Restricted Content";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

Additionally, you can also enable the UFW firewall:

```
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

That's the basic setup to start experimenting with a self-hosted LLM.