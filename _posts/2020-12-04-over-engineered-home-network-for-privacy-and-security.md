---
title: How I over-engineered my home network for privacy and security
description: How I used a UniFi Dream Machine, VLANs to segment IoT, Pi-Hole to block ads, cloudflared for DNS over HTTPS, and Cloudflare Gateway to block malware/phishing to (over) optimize my home network for privacy and security.
---

Back in April, when it looked like we were going to be spending some more time at home for a while, I decided to take on the project of upgrading my home Wi-Fi beyond an off-the-shelf consumer router. I'd been a Wirecutter devotee for almost as long as the site's been around and would have normally just grabbed their top pick, but I had just received [my SSCP (information security) certification](https://www.youracclaim.com/badges/7eb85996-c7fc-4c68-95df-fcd33ec445ba), and was looking for something a bit more advanced than the traditional plug-and-play setup to put my newly learned skills into practice.

While most home networking setups generally do a decent job of protect you from threats from the outside trying to come in, they don't often do a great job of managing risks originating from within your own network. Specifically, I had a number of goals:  

* **Privacy** - Minimize websites, device manufacturers, and my internet provider's ability to track my activity or monetize my information across all my devices
* **Security** - Block access to malicious sites to minimize the risk of human error, better understand how devices on my network are (mis)behaving, detect compromised devices, and limit their blast radius
* **Don't trust internet of things (IoT) devices** - Smart home devices have a notoriously poor track record when it comes to security (and privacy). Beyond manufacturers' lax security practices and general lack of hardening, updates are rare, and are often a manual process, earning minimal trust in my book. 
* **Ads** - Blocking intrusive, targeted, and malware-laden ads across devices. While you can install an extension on a desktop browser, such ad blockers are often resource intensive, easy for advertisers to restrict, and do little for mobile devices where I do most of my "fun" browsing, not to mention, cannot restrict IoT tracking.
* **It needs to "just work"** - Whatever solution I chose needed to be out-of-the-box or widely supported. No rooting, flashing new firmware, or modifying software which would lead to never-ending tinkering and could potentially introduce new vulnerabilities in the process.

If you want to head down this route as well, it's relatively straightforward, but definitely a (fun) "project". You'll need some basic familiarity with home networking (understanding how things like DNS and IPs work), as well as being comfortable SSH-ing into a linux device and copying and pasting a few commands. 

Here's how I over-engineered my home network for privacy and security:

* Contents
{:toc}

### The router - UniFi Dream Machine

I'd always [admired from afar the over-the-top home network setup](https://www.troyhunt.com/ubiquiti-all-the-things-how-i-finally-fixed-my-dodgy-wifi/) Ubiquiti's prosumer line offers, but for the space I'd be installing it in, the four digit minimum price tag to properly support a single access point was a bit beyond reasonable. Luckily UniFi recently came out with their [Dream Machine](https://store.ui.com/collections/unifi-network-routing-switching/products/unifi-dream-machine), which perfectly fit my needs. In UniFi terms it's an access point, switch, security gateway, and network controller all in one (which you'd otherwise have to buy separately).

While on paper it's similar to other high-end routers (beyond the processor and ram which are closer to a high-end smartphone), what really set it apart for me was [the interface](https://demo.ui.com/manage/site/default/dashboard) (for one, it didn't look like it was designed in the 90s) and level of insights and control it offered such as peeking into individual device's activity. That said, with great power comes great complexity, so there are a number of [footguns](https://en.wiktionary.org/wiki/footgun) you'll need to avoid, but overall, it's the best "router" I've owned.

### Using VLANs to segment low-trust devices

The primary driver for taking on that complexity was [segmenting IoT devices on their own network](https://www.zdnet.com/article/fbi-recommends-that-you-keep-your-iot-devices-on-a-separate-network/). Rather than connect them to a "guest" network as I had previously, I wanted devices I trust (my phone, tablet, or laptop) to be able to connect to and control smart home devices directly, but also wanted to make sure untrusted IoT devices couldn't monitor other network activity or try to access my trusted devices on their own.

I created three VLANs each with their own subnet, SSID, and capabilities:

| Network | Trust   | Capabilities                                                             |
| ------- | ------- | ------------------------------------------------------------------------ |
| Primary | Full    | Connect to the internet and other devices on the network                 |
| IoT     | Minimal | Connect to the internet and respond to requests from the primary network |
| Guest   | Zero    | Connect to the internet                                                  |
{: .table }

There are [lots of great walkthroughs of the firewall rules](https://robpickering.com/ubiquiti-configure-micro-segmentation-for-iot-devices/) already out there, but in short you'll want to create firewall rules to (1) allow connections from the primary network to the IoT network, (2) allow established connections from the IoT network back to the primary network, and (3) block all other connections from the IoT network to the primary network. With that, you'll have three distinct networks, each with their own capabilities and level of trust.[^2]

### Pi-Hole to block ads

Now it was time to address those pesky ads. [Pi-hole](https://pi-hole.net/) is a great app that can be installed on a Raspberry Pi or in a Docker container on your home network. Unlike an in-browser ad blocker, it filters content on the network level, meaning it works across devices (including mobile devices), doesn't consume system resources, and is more difficult for advertisers to detect and block. Not to mention, it can also prevent IoT and other smart home devices from "phoning home" with your personal information or usage data. The PiHole serves as your primary (or in my case, sole) DNS server. You provide it with a (crowd-sourced) blocklist of disallowed domains that it will refuse to resolve (preventing ads and tracking scripts from being loaded entirely - a process known as [DNS sinkholing](https://en.wikipedia.org/wiki/DNS_sinkhole)), forwarding all other domains to the upstream DNS server you specify.

To install Pi-Hole on a Raspberry Pi, you can follow [these instructions](https://blog.cryptoaustralia.org.au/instructions-for-setting-up-pi-hole/), which should take a few minutes to flash the Raspbian operating system onto an SD card and install the Pi-Hole software with a single command and guided setup. At one point you'll be prompted to set a static IP. You could either use the one assigned and reserve it for the Pi via the UniFi UI (my recommendation), or segment the Raspberry Pi on its own subnet. Either way, you'll want to adjust your firewall rules to ensure all local devices can reach your Raspberry Pi on port 53 (DNS).

If you followed the linked instructions, your Raspberry Pi should have a static IP, which you need to configure each VLAN to use as its DNS server under `Settings -> Networks -> Local Networks -> $NETWORK_NAME -> Edit -> DHCP Name Server`. 

### Cloudflared for DNS over HTTPS

Out of the box, the Raspberry Pi is going to forward any non-blocklisted domain lookups to the upstream DNS sever you set up in the previous step (Google, OpenDNS, etc.). The problem with this is that requests will leave your network unencrypted meaning your ISP and others can spy on, and potentially manipulate such requests and their response. While [DNSSEC](https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions) provides some assurance that you're talking to the DNS server you think you're talking to (which is why you should enable it under your Pi-Hole's DNS settings), it's not widely adopted and does little to address privacy concerns.

Enter [DNS over HTTPS](https://www.eff.org/deeplinks/2019/10/dns-over-https-will-give-you-back-privacy-congress-big-isp-backing-took-away) (DoH). Rather than using the unecrypted DNS protocol over port 53, DNS over HTTPS makes the DNS request over the same encryption used by most sites today (TLS). While Pi-Hole doesn't support DNS over HTTPS itself, we can run a DNS proxy on the Raspberry Pi which will forward the encrypted requests to our upstream DNS provider.

While [Cloudflare recommends the DNSCrypt route](https://blog.cloudflare.com/deploying-gateway-using-a-raspberry-pi-dns-over-https-and-pi-hole/), which I suspect you'd be equally happy with, I opted to use [cloudflared](https://github.com/cloudflare/cloudflared), since I knew I wanted to use Cloudflare as my upstream DoH provider. You can follow [the official Pi-Hole DNS over HTTPS guide](https://docs.pi-hole.net/guides/dns-over-https/) to install and configure cloudflared. As part of that configuration, you'll tell the Pi-Hole to use cloudflared as its upstream DNS server (by default, `127.0.0.1#5053`) instead of one of the commercial ones provided. With that, any non-blocklisted domain lookups will be forwarded to cloudflared, which itself will forward them to Cloudflare's DNS server over HTTPS for resolution, meaning all DNS queries made using your Pi-Hole will always leave your network encrypted.

### Blocking all other DNS lookups

Device manufacturers rely on the ability to "phone home" in order to monetize your usage information. To avoid the exact type of blocking I just described above, many devices (for example, Roku) come with Google or another DNS server hardcoded. Such devices will ignore the DNS server your router specifies and instead will try to use the manufacturer-defined DNS server, avoiding all the great ad-blocking and privacy securing networking we just set up. The good news is that most (all?) devices will fall back to your router-specified DNS server, if the default is unreachable.

To ensure devices _must_ use the Pi-Hole and DoH for DNS lookups, you could create a firewall rule to block Google's DNS specifically (as many online tutorial suggest), but I took it a step further and prevented all outbound requests over port 53 entirely to ensure all DNS from the network was filtered and encrypted. You can do this by creating a "DNS" port group on the UDM (port 53), and adding a WAN out reject rule for any traffic to that port. To confirm it's working, `dig example.com @8.8.8.8` should timeout when run from a device on your network (including the Raspberry Pi), but `dig example.com` should work as expected (and the page should load in your browser).

### Cloudflare Teams to block malicious sites

If you followed the Pi-Hole instructions above, cloudflared is most likely using the default [`1.1.1.1`](https://1.1.1.1) resolver, which is great, but does not block any malicious domains by default. You could update your `/etc/cloudflared/config.yml` file to point to [`1.1.1.2`](https://1.1.1.2) which filters phishing and malware (or `1.1.1.3` which also filters NSFW content), but I wanted a bit more control over what domains were filtered and why.

By creating a free [Cloudflare Gateway account](https://www.cloudflare.com/teams/gateway/), you essentially get your own `1.1.1.x` service, which you can more granularly configure, and also have the added benefit of seeing what domains were blocked, and why (to unblock, in the event of an over-eager rule). Once signed up, you'll want to create a "policy" (I creatively called mine "policy") and select which security threats and content categories you want to block. You'll also create a location (again, creatively called "home"), and grab the unique DNS over HTTPS address Cloudflare gives you for that policy-assigned location.

Finally, update `/etc/cloudflared/config.yml` on the Raspberry Pi to use the `https://*.cloudflare-gateway.com/dns-query` domain you received in the previous step. You'll also want to add `https://1.1.1.2/dns-query` as a secondary address, otherwise I found cloudflared has trouble bootstrapping itself to initially resolve your specific DNS server. `sudo systemctl restart cloudflared` and you should now be blocking ads, trackers, and malware from your network across all devices.

### Putting it all together

The average DNS request from your network would now look something like this:

1. Your device asks the Pi-Hole for the address to `example.com`
2. The Pi-Hole consults its blocklist, and if the domain is blocked, returns `0.0.0.0`. The domain is unreachable.
3. The PiHole forwards the request to cloudflared, which encrypts the request via DoH to Cloudflare Gateway.
4. Cloudflare gateway consults the malicious sites blocklist that you defined, and if the domain is blocked, returns `0.0.0.0`. The domain is unreachable.
5. If the domain is on neither the Pi-Hole nor Cloudflare's blocklists, the domain is resolved by Cloudflare and returned to your device in the reverse order.

If everything goes as expected, the entire experience should be transparent to devices on your network, and should "just work" with no need for ongoing upkeep, tinkering, or maintenance (not to mention, your devices will now benefit from all the privacy and security benefits described above).

### And more!

If you want to take things even further, there are a few more customizations to explore:

* **Additional UniFi security features** - UniFi offers [a number of advanced security-related features that you can enable in parallel](https://help.ui.com/hc/en-us/articles/360006893234-UniFi-USG-UDM-Configuring-Internet-Security-Settings):[^1]
    * **Intrusion prevention system** (IPS) - Detect and disrupt activity associated with known malware
    * **Deep packet inspection** - Gain visibility into what applications and services devices are communicating with
    * **Endpoint scanner** - Scan devices on your network to identify their operating system and what services they expose
    * **Internal honeypot** - A fake server, attractive to malware, that triggers alerts if something tries to connect to it
* **Block- and allow-lists** -  The whole point of a Pi-Hole is to block stuff. Once set up, you'll want to add/configure block- and allow-lists for your Pi-Hole. [firebog.net](https://firebog.net/) is the most popular meta-list. Beyond the ones listed there, I'd also recommend @StevenBlack's popular [lists](https://github.com/StevenBlack/hosts/) as well as @anudeepND's [popular allow list regular expression](https://github.com/anudeepND/whitelist) to ensure popular sites continue to work as expected.
* **Configure the Pi-Hole with a Let's Encrypt cert** - If the "Not secure" icon when accessing the Pi-Hole interface leaves you uneasy, you can [configure the Pi-Hole with a Let's Encrypt cert.](https://www.gilbertotorres.com/install-letsencrypt-ssl-into-pi-hole-server/) so that you can access the Pi-Hole admin interface over HTTPS. 
* **Mobile Apps** - Be sure to install the UniFi app ([iOS](https://apps.apple.com/us/app/unifi-network/id1057750338), [Android](https://play.google.com/store/apps/details?id=com.ubnt.easyunifi&hl=en_US&gl=US)) to receive push notifications for network alerts, and one of the many Pi-Hole apps ([Pi-Hole remote for iOS](https://apps.apple.com/us/app/pi-hole-remote/id1515445551), [FlutterHole for Android](https://play.google.com/store/apps/details?id=sterrenburg.github.flutterhole&hl=en_US&gl=US)) to quickly disable ad blocking in the (rare) event it breaks a site.

### Conclusion

Almost nine months later, things are working better than expected. WiFi speeds are fast (faster than my ISP advertises), ads are rare (I'm genuinely surprised when I see one), false positives are low (and easy to bypass), and I only accidentally unplugged the Raspberry Pi once (taking the entire network down in the process with it). It was a great project to put knowledge into practice (along with family GSuite and 1Password accounts, I recently heard it described as [rendering your home IT indistinguishable from a small business](https://twitter.com/rklau/status/1222674965951959040)), which I'd highly recommend if you're looking to level up your home-networking game, especially at a time when we're all spending more time at home working, browsing, and streaming.

Something I missed? Have a tip from your own home network? Leave a comment below and let me know.

[^1]: Another gotcha here, if you enable "DNS filtering", the dream machine will intercept all DNS requests across your network, ignoring the DNS server we specified and bypassing all the blocking and filtering you just set up.

[^2]: One gotcha, however, you'll see an "apply guest policies" option when you configure the guest network, but that option doesn't do what you might be familiar with a more traditional consumer router. You'll also need to create a dedicated guest VLAN with the explicit "guest" purpose under advanced, and assign that VLAN to the Guest SSID to ensure client isolation. Once you've done that, you should see the guest firewall rules automatically propagate to segment out the guest network. 
