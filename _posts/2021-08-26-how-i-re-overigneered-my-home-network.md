---
title: How I re-overengineered my home network for privacy and security
description:
---

A little under a year ago I wrote about [how I over-engineered my home network for privacy and security](https://ben.balter.com/2020/12/04/over-engineered-home-network-for-privacy-and-security/). I still stand by everything I wrote in that post, but since I published that post, I've automated some of the setup and management, to get ride of some of those "follow these random blog post instructions" and generally, to get out of the server management or sysadmin hobby and treat my Raspberry Pi less like a pet, and more like a  ___.

## Docker compose

First, rather than running services on "bare metal", I'll be among the first to admit that I know very little about linux system administration, and the less I can trust to me "getting it right", the better. Instead, I chose to make the bare minimum changes to the base image, and then use Docker Compose to run the services I need in containers. This has a number of advantages:

* **Isolation** - Beyond isolating one process from another through defined compute and networking interfaces, which itself brings a sense security, 
* **Trusted underlying system** and less muxing with the underling system and thus more confidence that it's working as intended,
* **Experimentation** -  I can more easily spin up experiments in containers (e.g., should I use `unbound` instead of `cloudflared`?) and quickly and easily clean them up, without worrying if I unintentionally modified something or left behind unnecessary cruft.
* **Build without drama** - For me, the standard install process for most services is to follow the documentation, and when that inevitably fails, to paste random StackOverflow commands into console until it works - npt exactly ideal. Docker absorbs that complexity on your behalf by having the maintainer define the build process, and ideally, provide a build image for your platform, so that you have one less thing to worry about.[^1]

Here's an example of what my docker-compose file looks like:

```docker-compose.yml
version: "3"

services:
  cloudflared:
    container_name: cloudflared
    restart: unless-stopped
    # Cloudflared doesn't have an armvf image, so we build from source
    build: https://github.com/cloudflare/cloudflared.git
    command: proxy-dns
    environment:
      # Replace with your teams domain or a public DNS over HTTPS server
      TUNNEL_DNS_UPSTREAM: "https://XXX.cloudflare-gateway.com/dns-query"
      TUNNEL_DNS_BOOTSTRAP: "https://1.1.1.2/dns-query"
      TUNNEL_DNS_ADDRESS: "0.0.0.0"
      TUNNEL_DNS_PORT: "53"

    # I'm pretty sure cloudflared doesn't use the bootstrap server, so we define it here again
    dns:
      - 1.1.1.2
      - 1.1.0.2
    networks:
      net:
        ipv4_address: 10.0.0.2
    healthcheck:
      test: ["CMD", "cloudflared", "version"]

  pihole:
    container_name: pihole
    restart: unless-stopped
    image: pihole/pihole
    secrets:
      - pihole_web_password
    environment: 
      TZ: America/New_York
      DNSSEC: "true"
      IPv6: "false"
      DNS_BOGUS_PRIV: "true"
      DNS_FQDN_REQUIRED: "true"
      TEMPERATUREUNIT: f
      PIHOLE_DNS_: "10.0.0.2"
      WEBPASSWORD_FILE: /run/secrets/pihole_web_password
      REV_SERVER: "true"
      REV_SERVER_TARGET: "192.168.1.1"
      REV_SERVER_CIDR: "192.168.0.0/16"
    ports: 
      - "53:53/tcp"
      - "53:53/udp"
      - "80:80/tcp"
    volumes:
      - './etc-pihole/:/etc/pihole/'
      - './etc-dnsmasq.d/:/etc/dnsmasq.d/'
    networks:
      net: {}
    dns:
      - "10.0.0.2"
    depends_on:
      - cloudflared
    healthcheck:
      test: ["CMD", "dig", "+norecurse", "+retry=0", "@127.0.0.1", "pi.hole"]
networks:
  net:
    driver: bridge
    ipam:
     config:
       - subnet: 10.0.0.0/29

# PiHole Web password lives in a .pihole_web_password to keep it out of the config
secrets:
  pihole_web_password: 
    file: .pihole_web_password
```

## Ansible

Beyond service installation and maintenance, the other aspect of PiHole management that was *bespoke* was provisioning. I could maintain a manual checklist that goes from blank SD card to fully functional PiHole, but ideally, that too could be automated, to prevent human error, and perhaps some day soon, allow for redundancy. 

There's a lot of provisioning tools out there, and you could probably be happy with many of them, but I went with Ansible, since it's simple to setup for a single target.

Here's the minimum you should do to set up docker compose on your Raspberry Pi:

```ansible
- hosts: all
  tasks:
    - name: update and upgrade apt packages
      become: true
      apt:
        upgrade: dist
        update_cache: true
    - name: Install docker dependencies
      become: true
      apt:
        name: "{{ item }}"
        state: present
        update_cache: true
      loop:
        - apt-transport-https
        - ca-certificates
        - curl
        - gnupg
        - lsb-release
        - python3-pip
        - python3-setuptools
    - name: add Docker GPG key
      become: true
      apt_key:
        url: https://download.docker.com/linux/debian/gpg
        state: present
    - name: add docker repository to apt
      become: true
      apt_repository:
        repo: deb [arch=armhf signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian buster stable
        state: present
    - name: install docker
      become: true
      apt:
        name: "{{ item }}"
        state: present
      loop:
        - docker-ce
        - docker-ce-cli
        - containerd.io
    - name: Add user to docker group
      become: true
      user:
        name: pi
        groups: docker
        append: true
    - name: Enable & Start Docker service
      become: true
      service:
        name: docker
        enabled: true
        state: started
    - name: Install pip components
      pip:
        executable: pip3
        name:
          - docker
          - docker-compose
          - virtualenv
    - name: Create and start docker compose services
      community.docker.docker_compose:
        # Change to path to your docker-compose.yml
        project_src: /home/pi/pi-hole
        pull: true
        build: true
      register: output
```

Beyond the above, here are a few nice automation to simplify provisioning and maintenance:
### Nice to have

```ansible
- hosts: all
  tasks:
    # Allows you to SSH in to the PiHole via SSH, instead of password auth
    - name: Ensure SSH Key is authorized
      authorized_key:
        user: pi
        state: present
        key: https://github.com/benbalter.keys
    
    # Ensure PiHole password is not the default
    # Here I'm using 1Password as my secret store, but you could use another source
    - name: Change pi user password
      become: true
      user:
        name: pi
        update_password: always
        password: "{{ lookup('community.general.onepassword', 'PiHole', field='Pi@ login') | password_hash('sha512') }}"

    # A deploy key allows you to pull (or push) from a private GitHub repo
    - name: Ensure deploy key is present
      community.crypto.openssh_keypair:
        path: "~/.ssh/id_github"
        type: ed25519
      register: deploy_key

    # If a new deploy key is generated, authorize it for the repo
    # Again, here I'm using 1Password as my secret store, but you could use another source
    - name: Ensure deploy key is authorized
      community.general.github_deploy_key:
        key: "{{ deploy_key.public_key }}"
        name: Raspberry Pi
        state: present
        owner: benbalter
        repo: pi-hole
        token: "{{ lookup('community.general.onepassword', 'PiHole', field='GitHub Token') }}"

    # I version my config in a private Git Repo, so I clone it down using the deploy key
    # Note: This will not work without modification, as it's a private repo
    - name: Clone GitHub repo
      git:
        repo: git@github.com:benbalter/pi-hole.git
        dest: /home/pi/pi-hole/
        clone: true
        update: true
        key_file: ~/.ssh/id_github
        accept_hostkey: true
```

Finally, in my Ansible config, I have a number of security best practices baked in:

### Even nicer to have

```ansible
    # Automatically upgrade apt packages
    - name: install unattended upgrades
      become: true
      apt:
        name: unattended-upgrades
        state: present
    - name: Setup unattended upgrades
      debconf:
        name: unattended-upgrades
        question: unattended-upgrades/enable_auto_updates
        vtype: boolean
        value: "true"
    # Prevents SSH brute force attacks
    - name: install fail2ban
      become: true
      apt:
        name: fail2ban
        state: present
    # Installs firewall
    - name: install ufw
      become: true
      apt:
        name: ufw
        state: present
    - name: limit ssh
      become: true
      ufw:
        rule: limit
        port: ssh
        proto: tcp
    - name: Allow all access to port 22, 53, and 80
      become: true
      ufw:
        rule: allow
        port: '{{ item }}'
      loop:
        - '22'
        - '53'
        - '80'
    - name: enable ufw and default to deny
      become: true
      ufw:
        state: enabled
        default: deny
```
---

[^1]: While pihole offers `armv7`/`armvf` (what the Raspberry Pi identifies as under the latest version of Raspberry OS) docker images, cloudflared does not, meaning you'll need to build cloudflared yourself. Unlike compiling from source and endless dependency drama, with a simple `docker build` and a few minute patience, you should be good to go.