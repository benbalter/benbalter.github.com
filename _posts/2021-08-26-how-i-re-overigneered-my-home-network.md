---
title: How I re-overengineered my home network for privacy and security
description:
---

This post is a follow up to my popular post [how I over-engineered my home network for privacy and security](https://ben.balter.com/2020/12/04/over-engineered-home-network-for-privacy-and-security/). If you haven't already checked that post out, it walks through how I used a UniFi Dream Machine, VLANs to segment IoT, a Pi-Hole to block ads, cloudflared for DNS over HTTPS, and Cloudflare Gateway to block malware/phishing to (over) optimize my home network for privacy and security.

What I wrote then remains true, but after having used the setup for over a year now, I've decided that "copy and paste these random commands from StockOverflow or some internet rando's blog" probably isn't the best way to run a security-conscious home network and have made a few improvements to how I setup, maintain, and manage things, that I'd like to share here. Specifically:

1. Using Ansible to setup the underlying "bare metal" hardware
2. Using Docker-Compose to maintain distinct services
3. Using Caddy to access the management interface over HTTPS

I was recently introduced to the idea of treating severs like cattle, not pets, and I'd like to get out of the bespoke sysadmin business as much as possible to further my "set it and forget it" goal.
## Docker compose

Rather than running applications on "bare metal" as I described in my original post, I now run the various software bits that support my home network as distinct services managed as Docker containers. For those unfamiliar, [Docker](https://www.docker.com) uses OS-level virtualization to automate the deployment of applications as portable, self-sufficient containers and [Docker Compose](https://docs.docker.com/compose/) is a tool for defining and running multiple Docker containers along side one another.

At first, the added complexity might feel counter intuitive for what seems like a straightforward service management problem. There are a number of notable advantages:

* **Install without drama** - The standard install process for most projects is to follow the documentation until that inevitably fails and then to paste random StackOverflow commands into console until it unexpectedly works. With Docker, I'm essentially outsourcing dependency and configuration management to project maintainers who know significantly more about the ecosystem than I do through standardized build processes and pre-compiled images.[^1]
* **Isolation** - Docker isolates process from another through defined compute, memory, and networking interfaces, which adds an additional layer of security and predictability. A vulnerability, bug, or misconfiguration in one service is less likely to affect another service, if services can only interact with one another through well-defined and well-understood paths. 
* **Trusted underlying system** - Docker allows me to make the bare minimum changes to the base image. The less I can trust to me "getting it right", the better. Less muxing with the underling system instills more confidence that things are working as intended.
* **Experimentation** -  Docker allows me to more easily spin up experiments in containers (for example, should I use `unbound` instead of `cloudflared`?) and quickly and easily clean them up without worrying if I unintentionally modified something or left behind unnecessary cruft. 

Here's an example of what my basic pihole + cloudflared docker-compose file looks like:

<details markdown=1 class="mb-3">
<summary><strong>Example <code>docker-compose.yml</code> file</strong></summary>


```yml
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
      VIRTUAL_HOST: dns.example.com
    ports: 
      - "53:53/tcp"
      - "53:53/udp"
    volumes:
      - './etc-pihole/:/etc/pihole/'
      - './etc-dnsmasq.d/:/etc/dnsmasq.d/'
    networks:
      net:
        ipv4_address: 10.0.0.3
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

</details>

Docker and Docker Compose introduced some pretty impressive improvements in terms of service maintenance and provisioning, but it didn't account for all the bits that make Docker work or that configure and maintain the underlying Raspberry Pi, which was still a *bespoke* operation.

## Ansible

I could maintain a manual checklist that goes from blank SD card to fully functional PiHole, but ideally, that too could be automated to prevent human error, and perhaps some day soon, allow for redundancy. That's where Ansible comes in.

There's a lot of provisioning tools out there, and you could probably be happy with many of them. I'd never used Ansible before, but I went with it for a few reasons:

1. **Setup** - Ansible is unique in that it doesn't require a dedicated management server to provision other servers. Instead, it runs as a Python script on your desktop, SSHing in to your Raspberry Pi directly and running the commands you specify, as if you were running them yourself.
2. **Documentation** - I was immediately impressed by Ansible's documentation. Everything was consistent, thorough, and easy to understand. It even had helpful tips like "avoid unnecessary complexity" (and the design patterns to support them), which I appreciated, given that I was only using it to manage one server.
3. **Community** - I've yet to find a feature that I was hoping would exist, that wasn't provided via a (core- or) community-maintained package. Set a static IP? Generate and authorize a GitHub deploy key? Clone a private repo? Configure the firewall? Start docker compose? Someone already solved all those problems for you.

My "setup playbook" document went from about two dozen complex steps to the following:

1. Download the [Raspberry Pi Imager](https://www.raspberrypi.org/software/) and flash the latest version of Raspberry Pi OS *Lite*.
2. Run `ansible-playbook playbook.yml --inventory hosts.yml` from my laptop
3. Sit back and wait until you have a fully configured PiHole running in about 5-10 minutes

Best of all, since Ansible is idempotent by design, upgrading the underlying distribution, updating dependencies, pulling fresh Docker images, and resolving any configuration drift is as simple as repeating step two above.

Here's the minimum you should do to set up Docker Compose on your Raspberry Pi:

<details markdown=1 class="mb-3">
<summary><strong>Example Ansible <code>playbook.yml</code> file for running Docker Compose services</strong></summary>

```yml
- hosts: all
  tasks:
    - name: update and upgrade apt packages
      become: true
      apt:
        upgrade: dist
        update_cache: true
    - name: Install network manager
      become: true
      apt:
        name: network-manager
        state: present
    # Set Static IP of PiHole so other devices can query it for DNS lookups
    - name: configure network
      become: true
      community.general.nmcli:
        state: present
        conn_name: eth0
        ifname: eth0
        type: ethernet
        ip4: 192.168.1.2/24
        gw4: 192.168.1.1
        dns4:
          - 1.1.1.2
    - name: Install docker dependencies
      become: true
      apt:
        name: "{% raw %}{{ item }}{% endraw %}"
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
        name: "{% raw %}{{ item }}{% endraw %}"
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
    # Set PiHole (Web Admin) password, referenced above. 
    # Again, I'm using 1Password, but you could use any secret store.
    - name: Set Pi-Hole secret
      copy:
        dest: /home/pi/pi-hole/.pihole_web_password
        content: "{% raw %}{{ lookup('community.general.onepassword', 'Raspberry pi', field='password') }}{% endraw %}"
    - name: Create and start docker compose services
      community.docker.docker_compose:
        # Change to path to your docker-compose.yml. See below for how to clone a repo
        project_src: /home/pi/pi-hole
        pull: true
        build: true
        remove_orphans: true
      register: output
```

</details>

Beyond the above, here are a few nice automation to simplify provisioning and maintenance:

<details markdown=1 class="mb-3">
<summary><strong>Additional convenience task to add to your Ansible <code>playbook.yml</code> file</strong></summary>

```yml
# Allows you to SSH in to the PiHole via SSH, instead of password auth, pulling from your GitHub Public key
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
    password: "{% raw %}{{ lookup('community.general.onepassword', 'PiHole', field='Pi@ login') | password_hash('sha512') }}{% endraw %}"

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
    key: "{% raw %}{{ deploy_key.public_key }}{% endraw %}"
    name: Raspberry Pi
    state: present
    owner: benbalter
    repo: pi-hole
    token: "{% raw %}{{ lookup('community.general.onepassword', 'PiHole', field='GitHub Token') }}{% endraw %}"

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

</details>

Finally, in my Ansible config, I have a number of security tasks that I included and recommend you follow:

<details markdown=1 class="mb-3">
<summary><strong>Security best practices I included in my Ansible <code>playbook.yml</code></strong></summary>

```yml
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

# Rate limits SSH attempts
- name: limit ssh
  become: true
  community.general.ufw:
    rule: limit
    port: ssh
    proto: tcp

# Firewall rules
- name: Allow all access to SSH, DNS, and WWW
  become: true
  community.general.ufw:
    rule: allow
    port: '{% raw %}{{ item }}{% endraw %}'
  loop:
    - SSH
    - DNS
    - WWW
    - WWW Secure
- name: enable ufw and default to deny
  become: true
  ufw:
    state: enabled
    default: deny
```

</details>

Between Ansible and Docker Compose, I was happy with my setup and maintained my network, but management of the PiHole Web interface (and API), still sent passwords, tokens, and sensitive data in the clear.

### Caddy

While admittedly, since my PiHole was only available on my home network, and even then, non-DNS traffic was visible to highly-trusted devices, the risk of transferring passwords, tokens, and sensitive data in the clear was low (all other network users had an API key in order to disable blocking when it broke functionality), I still didn't like the idea of accessing something as sensitive as the PiHole web interface over HTTP, especially when it could lead to a DNS poising attack.



---

[^1]: While pihole offers `armv7`/`armvf` (what the Raspberry Pi identifies as under the latest version of Raspberry OS) docker images, cloudflared does not, meaning you'll need to build cloudflared yourself. Unlike compiling from source and endless dependency drama, with a simple `docker build` and a few minute patience, you should be good to go.