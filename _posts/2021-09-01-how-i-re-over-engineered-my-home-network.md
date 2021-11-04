---
title: How I re-over-engineered my home network for privacy and security
description: How I used Docker Compose, Ansible, and Caddy to re-over-engineer my UniFi Dream Machine, PiHole/AdGuard Home, and Cloudflare-based home network for ease of setup, maintenance, and management.
---

A little less than a year ago, I wrote a now-popular post about [how I over-engineered my home network for privacy and security](https://ben.balter.com/2020/12/04/over-engineered-home-network-for-privacy-and-security/). If you haven't already checked that post out, it walks through how I used a UniFi Dream Machine (although most routers would work), a Pi-Hole to block ads and tracking, cloudflared for DNS over HTTPS, and Cloudflare Gateway to block malware/phishing to (over) optimize my home network for privacy and security.

What I wrote then remains true, but after having relied on, optimized, and upgraded what I described in my previous post for about eighteen months now, I've decided to build on what's there by ~~revisiting~~ re-over-engineering how I setup, maintain, and manage the software and services that power and protected the network with a number of specific goals in mind:

* **Config (and infrastructure) as code** - This is by far from a new concept to the industry, but I was somewhat-recently introduced to the idea of [treating servers like cattle, not pets](http://cloudscaling.com/blog/cloud-computing/the-history-of-pets-vs-cattle/). While config as code may come more naturally when managing a cluster of servers, even when managing only a single Raspberry Pi, prefer defined and well-understood changes over guess-and-check server administration.
* **Outsource to the experts** - The less I can trust to me "getting it right", the better. "Copy and paste these random commands from StockOverflow" isn't the best way to run a security-conscious home network. Instead, rely on the open source community's established, vetted, and maintained builds, configurations, and defaults through known and trusted distribution channels.
* **It (still) needs to “just work”** - A dependency update shouldn't be able to steal hours of my weekend due to an unexpected conflict or config change. I wanted to get out of the bespoke sysadmin business, provisioning and then immediately walking away from "set it and forget it" systems wherever possible. Ideally, systems would update themselves regularly, and upgrades would be predictable and boring.

If you want to head down [this route](https://github.com/benbalter/pi-hole-cloudflared-docker-compose-ansible-caddy), beyond having read [the original post](https://ben.balter.com/2020/12/04/over-engineered-home-network-for-privacy-and-security/) along with some basic familiarity with home networking (understanding how things like DNS and IPs work), it would help to have some conceptual familiarity with containerization and provisioning tools to adapt the setup to your own needs. With that, here's how I re-over-engineered my home network with a few improvements to how I setup, maintain, and manage things:

1. [Using Docker-Compose to maintain distinct services](#docker-compose)
2. [Using Ansible to setup the underlying "bare metal" hardware](#ansible)
3. [Using Caddy to secure the management interface with HTTPS](#caddy)

### Pi-Hole vs AdGuard Home

**Edit (2021-11-4):** Since originally publishing this post, I've swapped out AdGuard Home for Pi-Hole + Cloudflared. While ultimately you could be happy with either, and this guide continues to work for both, I ended up prefering AdGuard Home for a number of reasons:

* **A more modern stack** - PHP + dnsmasq vs. Go and React
* **Admin experience** - a sleeker web interface with fewer knobs and dials to endlessly tinker with
* **One less point of failure** - Native DoH support meant I could illiminate cloudflared entirely, while still using Cloudflare Teams as my upstream resolver
* **Config as code** - Settings are contained in a single YAML file that I could version

Pi-Hole has been around for longer and has a more established community, so again, you could be happy with either, but I've updated this post to reflect that since originally written, I now prefer AdGuard Home. With that, let's get on to the setup:

### Docker Compose

Rather than running applications on "bare metal" as I described in [my original post](https://ben.balter.com/2020/12/04/over-engineered-home-network-for-privacy-and-security/), I now run the various software bits that support my home network as distinct services managed as Docker containers. 

For those unfamiliar, [Docker](https://www.docker.com) uses OS-level virtualization to automate the deployment of applications as portable, self-sufficient containers and [Docker Compose](https://docs.docker.com/compose/) is a tool for defining and running multiple Docker containers alongside one another. 

At first, the added complexity might feel counter intuitive for what seems like a straightforward service management problem, but there are a number of notable advantages to using Docker here:

* **Install without drama** - The standard install process for most projects is to follow the documentation until the instructions inevitably fail and then to paste random commands from the internet in to console until it inexplicably works. With Docker, I'm essentially outsourcing dependency and configuration management (through standardized build processes and pre-compiled images) to the projects' maintainers who know infinitely more about the ecosystem than I ever will.[^1]
* **Isolation** - Docker isolates process from one another through defined compute, memory, and networking interfaces, which adds an additional layer of security and predictability. A vulnerability, bug, or misconfiguration in one service is less likely to affect another service if applications can only interact with one another through well-defined and well-understood paths. Think micro-services vs. monolith.
* **Trusted underlying system** - Docker allows me to make the bare minimum changes to the base image. This is especially valuable when it comes to experimentation (for example, test whether I should use `unbound` instead of `cloudflared`?), being able to quickly and easily clean up short-lived containers without worrying if I unintentionally modified something of consequence or left behind unnecessary cruft.

#### AdGuard Home `docker-compose.yml` file 

Here's an example of what my simple AdGuard Home `docker-compose.yml` file looks like to define the services:

<details markdown=1 class="mb-3">
<summary><strong>Example <code>docker-compose.yml</code> file</strong></summary>

```yml
version: "3"

services:
  adguardhome:
    container_name: adguardhome
    restart: unless-stopped
    image: adguard/adguardhome
    ports:
      - 53:53/tcp
      - 53:53/udp

    volumes:
      - ./adguard-work:/opt/adguardhome/work
      - ./adguard-conf:/opt/adguardhome/conf

    networks:
      net:
        ipv4_address: 10.0.0.2
```

</details>

#### PiHole + cloudflared `docker-compose.yml` file 

And here's my original, slightly-more-complex PiHole + cloudflared `docker-compose.yml` file that defined the two services:

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
      # Replace with your Cloudflare Gateway domain or a public DNS over HTTPS server
      TUNNEL_DNS_UPSTREAM: "https://XXX.cloudflare-gateway.com/dns-query"
      TUNNEL_DNS_BOOTSTRAP: "https://1.1.1.2/dns-query"
      TUNNEL_DNS_ADDRESS: "0.0.0.0"
      TUNNEL_DNS_PORT: "53"

    # I'm pretty sure cloudflared doesn't use the bootstrap server, so we define it here too
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
      # Replace with your desired configuration
      TZ: America/New_York
      DNSSEC: "true"
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

In short, less muxing with the underling system and better-defined interfaces instills more confidence that services are well-understood and that things are working as intended. 

Docker and Docker Compose introduced some pretty impressive improvements in terms of service maintenance and provisioning, but it didn't account for all the bits that make Docker work or that configure and maintain the underlying Raspberry Pi, which was still a largely *bespoke* operation.

### Ansible

I had originally maintained a manual copy-and-paste checklist that got me from blank SD card to fully functional PiHole, but ideally, that too could be automated to prevent human error, and perhaps some day soon, allow for redundancy of servers. That's where [Ansible](https://www.ansible.com) comes in.[^2]

Ansible is a provisioning, configuration management, and application-deployment tool that allows you to further run your infrastructure as code. There's a lot of infrastructure as code tools out there, and you could probably be happy with any of them. While I'd never used Ansible before, I went with it for a few reasons:

* **Setup** - Ansible is unique in that it doesn't require a dedicated management server or cloud service to provision servers. Instead, it runs as a Python app on your desktop. You define a YML file, it SSHes in to your Raspberry Pi directly and implements the directives you specify, as if you were running the underlying commands yourself.
* **Documentation** - I was immediately impressed by Ansible's documentation. Everything was consistent, thorough, and easy to understand. It even had helpful tips like "avoid unnecessary complexity" (and the design patterns to support them), which I appreciated, given that I was only using it to manage one server.
* **Community** - I've yet to find a feature that I was hoping would exist that wasn't provided via a (core- or) community-maintained package. Install apt packages? Set a static IP? Generate and authorize a GitHub deploy key? Clone a private repo? Configure the firewall? Start Docker and Docker Compose? Someone already solved all those problems for you.

#### Three-step setup

My manual "setup playbook" documentation went from about two dozen complex and error-prone steps down to the following:

1. Download the [Raspberry Pi Imager](https://www.raspberrypi.org/software/) and flash the latest version of Raspberry Pi OS *Lite*.
2. Run `ansible-playbook playbook.yml --inventory hosts.yml` from my laptop
3. Sit back and wait until I have a fully configured PiHole running in about 5-10 minutes

Best of all, since Ansible is idempotent by design, upgrading the underlying distribution, updating dependencies, pulling fresh Docker images, and resolving any configuration drift is as simple as repeating step two above to re-run the playbook.

#### Playbook

Here's the minimum playbook you should use to set up Docker Compose on your Raspberry Pi:

<details markdown=1 class="mb-3">
<summary><strong>Example Ansible <code>playbook.yml</code> file for running Docker Compose services</strong></summary>

```yml
- hosts: all
  tasks:
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
    # I'm using 1Password, but you could use any secret store.
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
# Update system-level dependencies
- name: update and upgrade apt packages
  become: true
  apt:
    upgrade: dist
    update_cache: true

# Set Static IP of PiHole so other devices can query it for DNS lookups
- name: Install network manager
  become: true
  apt:
    name: network-manager
    state: present
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

Finally, in my Ansible config, I have a number of security tasks that I added and recommend you include in your playbook:

<details markdown=1 class="mb-3">
<summary><strong>Security best practices I included in my Ansible <code>playbook.yml</code> file</strong></summary>

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

Between Ansible and Docker Compose, I was happy with how I setup and maintained my network, but management of the PiHole Web interface (and API), still sent passwords, tokens, and sensitive data in the clear.

### Caddy

While admittedly, since my PiHole was only available on my home network, and even then, non-DNS traffic was visible only to highly-trusted devices, the risk of sending passwords, tokens, and other sensitive data in the clear was relatively low (all other network users had an API key in order to temporarily disable blocking if it broke functionality), I still didn't like the idea of accessing something as sensitive as the PiHole web interface over HTTP.[^3]

I had been searching for the best way to expose the PiHole admin (web and API) interfaces over HTTPS, and while the native lighttpd sever can support HTTPS, it required either a self-signed cert., which came with its own challenges, or a lot of setup and maintenance on my part to use a Let's Encrypt or similar cert., which I was looking to avoid. I settled on the previously unknown to me [Caddy project](https://caddyserver.com), for a number of reasons:

* **Certificate provisioning and renewal** - One of the most challenging parts of supporting HTTPS is certificate management. Caddy automatically obtains and renews Lets Encrypt certificates for you. It can even handle DNS ACME challenges via its many DNS provider plugins, to support creating certificates for servers not exposed to the public internet.
* **Setup** - With a ~5 line "Caddyfile", I was ready to go. Caddy serves as a TLS terminator, proxying HTTP requests to the PiHole web interface via Docker's virtualized network. It handles the HTTPS transit over the home network, completely transparent to the PiHole service. 
* **Standards and defaults** - HTTP/2? HTTP/3? TLS 1.3? Cipher suites? Key rotation? Redirects? Similar to Docker allowing me to offload the build process to maintainers, Caddy's opinionated defaults meant I had a "good" HTTPS connection out of the box, without needing to tweak anything.

#### Docker Compose service to define Caddy

I set up Caddy by adding the following ~25 lines to my Docker Compose definition:

<details markdown=1 class="mb-3">
<summary><strong>Example <code>docker-compose.yml</code> additions to support Caddy/HTTPS</strong></summary>

```yml
services:
  caddy:
    build:
      context: .
      dockerfile: caddy.Dockerfile
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80" # For HTTP -> HTTPS redirects
      - "443:443"
    volumes:
      - $PWD/Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    env_file:
      - .caddy.env
    dns:
      - 1.0.0.3
    healthcheck:
        test: ["CMD", "caddy", "version"]
    depends_on:
      - adguardhome
      # Replace with the following for pi-hole:
      # - pihole
      # - cloudflared
    networks:
      net: {}

volumes:
  caddy_data:
    external: true
  caddy_config:
```

</details>

Because I was using a DNS-based ACME challenge, instead of the standard HTTP challenge (since the server was not exposed to the public internet), I needed a custom Caddy build that included my DNS provider. Fortunately, the Caddy community makes this easy with a custom Docker build file:

<details markdown=1 class="mb-3">
<summary><strong>Example <code>caddy.Dockerfile</code> to build Caddy with custom challenge support</strong></summary>

```dockerfile
FROM caddy:builder AS builder

RUN xcaddy build \
    --with github.com/caddy-dns/cloudflare

FROM caddy:latest

COPY --from=builder /usr/bin/caddy /usr/bin/caddy
```

</details>

#### Caddyfile to proxy HTTPS traffic to Pi-Hole or AdGuard Home

Here's my Caddy file config to define Caddy's behavior to proxy HTTPS requests back to the PiHole or AdGuard Home web backend:

<details markdown=1 class="mb-3">
<summary><strong>Example <code>caddyfile</code> to proxy HTTPS to the PiHole web interface</strong></summary>

```caddyfile
dns.example.com

reverse_proxy 10.0.0.3:80

tls you@example.com {
  # I use cloudflare here for DNS, but you can use any provider
  dns cloudflare {env.CLOUDFLARE_API_TOKEN}
  resolvers 10.0.0.3
}

# Not necessary, but built-in compression can speed things up a bit
encode zstd gzip
```

</details>

#### Ansible Playbook task to support Caddy secrets

And last, I added the following to my Ansible `playbook.yml` file to make my Cloudflare API token available[^4] to Caddy's ACME challenge logic:

<details markdown=1 class="mb-3">
<summary><strong>Example Ansible <code>playbook.yml</code> task to expose Cloudflare Token to Caddy</strong></summary>

```yml
- name: Set Caddy secret
  copy:
    dest: /home/pi/pi-hole/.caddy.env
    # I'm using 1Password here, but you could use any secret store you wanted
    content: "CLOUDFLARE_API_TOKEN={% raw %}{{ lookup('community.general.onepassword', 'Raspberry pi', field='Cloudflare Token') }}{% endraw %}"
```

</details>

### Conclusion

While everything I previously described in the "[pulling it all together](https://ben.balter.com/2020/12/04/over-engineered-home-network-for-privacy-and-security/#putting-it-all-together)" section remains true in terms of service-to-service flow, setup, maintenance, and management are now vastly simplified through well-defined and well-understood service definitions.

The two-dozen or so clients on my home network generate around 125,000 DNS queries a day on average, of which, about 50% are blocked by the PiHole and a handful more might be blocked by Cloudflare's filtering. Surprisingly, the move to Docker actually seemed to improved performance[^5] (I was worried about overhead from the virtual network) with a 0-5% average load and DNS response times generally around 2ms with AdGuard Home (20ms when running PiHole). Plenty of reserve capacity to re-re-over-engineer things next summer...

Eighteen months since [I originally over-engineered my home network](https://ben.balter.com/2020/12/04/over-engineered-home-network-for-privacy-and-security/), ads remain rare, false positives are still low, and I've learned a lot about many of the behind-the-scenes technologies we've come to take for granted every day.  If you're looking to implement a similar set up (or do and find ways to improve it), you can find all the configuration files references above (and more!) over at [benbalter/pi-hole-cloudflared-docker-compose-ansible-caddy](https://github.com/benbalter/pi-hole-cloudflared-docker-compose-ansible-caddy) on GitHub. 

Now that my privacy- and security-centric home network is codified as code, [pull requests are welcome](https://github.com/benbalter/pi-hole-cloudflared-docker-compose-ansible-caddy)!

[^1]: While pihole offers `armv7`/`armvf` (what the Raspberry Pi identifies as under the latest version of Raspberry OS) docker images, cloudflared does not, meaning you'll need to build cloudflared yourself. Unlike compiling from source and endless dependency drama, with a simple `docker build` and a few minute patience, you should be good to go.
[^2]: The Ansible website doesn't make mention of, let alone link to to its open source repo, for some reason, but rest assured, it's an open source project under the freemium model, and the "community" edition will be enough to meet your needs of managing 1-2 devices.
[^3]: In theory, a compromised device on my trusted network could sniff the credentials to the PiHole management interface resulting in a DNS poisoning attack. Regardless of the likelihood, it didn't feel right to spend so much time securing my network DNS, only to make the management credentials so readily available.
[^4]: Ideally, I would have used Docker's native secret management, but secrets can only be exposed as a file, not an environmental variable which Caddy expects. I used a narrowly scoped API token to mitigate the risk.
[^5]: I may have been using the non-"lite" Raspberry Pi image previously (which includes desktop components), but without a version-controlled system definition, I ironically, have no way to be sure, and thus no accurate performance baseline to compare.