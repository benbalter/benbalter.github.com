---
title: How I over-engineered my home network for privacy and security
description:
---

Back in April, when it looked like we were going to be spending some more time at home for a while, I decided to take on the project of upgrading my home Wi-Fi beyond an off-the-shelf consumer router. I'd been a Wirecutter devotee for almost as long as the site's been around and would have normally grabbed their top pick, but I had just received [my SSCP certification](https://www.youracclaim.com/badges/7eb85996-c7fc-4c68-95df-fcd33ec445ba), and was looking for something a bit more advanced than the traditional plug-and-play setup.

While most networking setups generally do a decent job of protect you from threats from the outside trying to come in, they don't often do a great job of managing risks originating from within your network. Specifically, I had a number of goals:  

* **Privacy** - Minimize websites, device manufacturers, and my internet provider's ability to track my activity or monetize my information across all my devices
* **Security** - Block access to malicious sites to minimize the risk of human error, better understand how devices on my network are behaving, detect compromised devices, and limit their blast radius
* **Don't trust internet of things devices** - Smart home devices have a notoriously poor track record when it comes to security (and privacy). Beyond manufacturers' security practices and general hardening, updates are rare, and are often a manual process, earning minimal trust in my book. 
* **Ads** - Blocking intrusive and targeted ads across devices. While you can install an extension on a desktop browser, such ad blockers are often resource intensive, easy for advertisers to restrict, and do little for mobile devices where I do most of my "fun" browsing, not to mention, cannot restrict IoT tracking.
* **It needs to "just work"** - Whatever solution I chose needed to be out-of-the-box or widely supported. No rooting, flashing new firmware, or modifying software which would lead to never-ending tinkering and potentially introduce new vulnerabilities in the process.

### The router - Unify Dream Machine

I'd always [admired the over-the-top home network setup](https://www.troyhunt.com/ubiquiti-all-the-things-how-i-finally-fixed-my-dodgy-wifi/) Ubiquiti's prosumer line offers, but for the space I'd be installing it, the four digit minimum price tag to properly support a single access point was a bit beyond reasonable. Luckily UniFi recently came out with their [Dream Machine](https://store.ui.com/collections/unifi-network-routing-switching/products/unifi-dream-machine), which perfectly fit my needs. In UniFi terms it's an access point, switch, security gateway, and network controller all in one (which you'd otherwise have to buy separately).

While on paper it's similar to other high-end routers (beyond the processor and ram which are closer to a high-end smart phone than a router), what really set it apart for me was [the interface](https://demo.ui.com/manage/site/default/dashboard) (for one, it didn't look like it was designed in the 90s) and level of insights and control it offered such as peeking into individual device's activity. With great power comes great complexity, so there are some [footguns](https://en.wiktionary.org/wiki/footgun) to be sure, but overall, it's the best "router" I've owned.

### Using VLANs to segment low-trust devices

The primary driver for taking on that complexity was [segmenting IoT devices on their own network](https://www.zdnet.com/article/fbi-recommends-that-you-keep-your-iot-devices-on-a-separate-network/). Rather than connect them to a "guest" network as I had previously, I wanted trusted devices (my phone, tablet, or laptop) to be able to control smart home devices, but also wanted to make sure those devices couldn't monitor other network activity or try to connect to trusted devices on their own.

I created three VLANs each with their own SSID and capabilities:

| Network | Trust   | Capabilities                                                             |
| ------- | ------- | ------------------------------------------------------------------------ |
| Primary | Full    | Connect to the internet and other devices on the network                 |
| IoT     | Minimal | Connect to the internet and respond to requests from the primary network |
| Guest   | Zero    | Connect to the internet                                                  |

There are [lots of great walk throughs of the firewall rules](https://robpickering.com/ubiquiti-configure-micro-segmentation-for-iot-devices/) already out there, but in short you'll want to create firewall rules to (1) allow connections from the primary network to the IoT network, (2) allow established connections from the IoT network back to the primary network, and (3) block all other connections from the IoT network to the primary network.

One gotcha, however, you'll see an "apply guest policies" when you configure the guest network, but that option doesn't do what you might be familiar with a more traditional consumer router. You'll also need to create a dedicated guest VLAN with the explicit "guest" purpose under advanced, and assign that VLAN to the Guest SSID to ensure client isolation. Once you've done that, you should see the guest firewall rules automatically propagate to segment out the guest network.

### Pi-Hole to block ads

[Pi-hole](https://pi-hole.net/) is a great app that can be installed on a Raspberry Pi or in a Docker container on your home network. Unlike an in-browser ad-blocker, it filters content on the network level, meaning it works across devices (including mobile devices), doesn't consume system resources, and is more difficult for advertisers to detect and block. Not to mention, it can also prevent IoT and other smart home devices from "phoning home" with your usage data. You provide it with a (crowdsourced) blocklist of disallowed domains and it refuses to resolve those domains (preventing ads and tracking scripts from being loaded entirely), forwarding all other domains to an upstream DNS server.

To install Pi-Hole on a Raspberry Pi, you can follow [these instructions](https://blog.cryptoaustralia.org.au/instructions-for-setting-up-pi-hole/), which should take a few minutes to flash the Raspbian operating system onto an SD card and install the Pi-Hole software with a single command and guided setup. At one point you'll be prompted to set a static IP. You could either use the one assigned and reserve it for the Pi via the Unify UI (my recommendation), or segment the Raspberry Pi on its own subnet. Either way, you'll want to adjust your firewall rules to ensure all local devices can reach your Raspberry Pi on port 53 (DNS).

If you followed the linked instructions, your Raspberry Pi should have a static IP, which you need to configure each VLAN to use as its DNS server under `Settings -> Networks -> Local Networks -> $NETWORK_NAME -> Edit -> DHCP Name Server`.

### Cloudflared for DNS over HTTPS

Out of the box, the Raspberry Pi is going to forward any non-blocklisted domain lookups to the upstream DNS sever you setup in the previous step (Google, OpenDNS, etc.). The problem with this is that requests will leave your network unencrypted meaning your ISP and others can spy on, and potentially manipulate such requests and their response. While DNSSEC provides some assurance that you're talking to the DNS server you think you're talking to (which is why you should enable it under your Pi-Hole's DNS settings), it's not widely adopted and does little to address privacy concerns.

Enter [DNS over HTTPS](https://www.eff.org/deeplinks/2019/10/dns-over-https-will-give-you-back-privacy-congress-big-isp-backing-took-away) (DoH). Rather than using the unecrypted DNS protocol over port 53, DNS over HTTPS makes the DNS request over the same encryption used by most websites today (TLS). While Pi-Hole doesn't support DNS over HTTPS out of the box, we can run a DNS proxy on the Raspberry Pi which can forward tne encrypted requests to the upstream DNS provider.

While [Cloudflare recommends the DNSCrypt route](https://blog.cloudflare.com/deploying-gateway-using-a-raspberry-pi-dns-over-https-and-pi-hole/), which I suspect you'd be equally happy with, I opted to use [cloudflared](https://github.com/cloudflare/cloudflared), since I knew I wanted to use Cloudflare as my upstream DoH provider. You can follow [the official Pi-Hole DNS over HTTPS guide](https://docs.pi-hole.net/guides/dns-over-https/) to install and configure cloudflared. As part of that configuration, you'll tell the Pi-Hole to use cloudflared as its upstream DNS server (by default, `127.0.0.1#5053`).

### Blocking all other DNS lookups

Many devices (for one, Rokus) come with Google, or another DNS server hardcoded. Meaning, those devices will ignore the DNS server your router specifies, and instead, will try to use the manufacturer-defined DNS server, avoiding all the great ad-blocking and privacy securing networking we just set up. The good news is that most (all?) devices will fall back to your router-specified DNS server, if the default is unreachable.

To ensure devices _must_ use the Pi-Hole and DoH for DNS lookups, you could create a firewall rule to block Google's DNS specifically, but I took it a step further and prevented all outbound requests over port 53 entirely to ensure all DNS from the network was filtered and encrypted. You can do this by creating a "DNS" port group on the UDM (port 53), and adding a WAN out reject rule for any traffic to that port. To confirm it's working, `dig google.com @8.8.8.8` should timeout when run from a device on your network (including the Raspberry Pi), but `dig google.com` should work as expected (and the page should load in your browser).

### Cloudflare Teams to block malicious sites

### And more

* IPS, honeypot
* Testing servers on the pi
* 
https://scotthelme.co.uk/securing-dns-across-all-of-my-devices-with-Pi-Hole-dns-over-https-1-1-1-1/