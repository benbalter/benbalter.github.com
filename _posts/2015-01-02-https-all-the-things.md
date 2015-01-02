---
title: "Why you should care about HTTPS, even if you have nothing to hide"
excerpt: "HTTPS ensures not only the privacy of the content you request, but also, protects the fact that you're even requesting it in the first place. HTTPS isn't just for secure transactions like online banking and ecommerce. HTTPS is for any website that adds to the public dialog."
---

You're probably already familiar with technologies like SSL and TLS. They're the little green icon in the top left corner of your browser anytime you visit a website with a URL that begins with `https://`. They're most often used to secure sensitive web requests, like checking your bank account balance or purchasing stuff online. HTTPS encrypts the connection between your computer and the server you're talking to so that nobody can jump in the middle.[^injection]

Traditionally, the arguments in favor of HTTPS have been for privacy, integrity, and identity. If a message is encrypted by a server before it's sent to your computer, and its done in such a way that only you can decrypt it, you can have a high level of confidence that the message you receive is the message the server sent, and that you're the only one who opened it. Further still, because of the initial handshake that makes all this possible, you know that the server you're talking to is the one you want to talk to, and not someone else pretending to be the server. Without HTTPS, there's a couple of points in the route each request must take that could allow a third-party to intercept, or worse, modify your request or its response as it travels over the open internet.

Before this week, I, like I suspect most people, thought HTTPS was only for requests that needed to be secure. After all, that's what the "S" in HTTPS stands for. But with [GitHub being blocked in India](http://techcrunch.com/2014/12/31/indian-government-censorsht/), I realized there's another, much more universal argument in favor of HTTPS: *censorship*.

Whether a corporate firewall or a country-wide block, intercepting and screening an HTTPS-backed website becomes significantly harder. While an ISP or employer could easily standup a proxy or other firewall to inspect and filter incoming traffic for objectionable content, if that traffic is encrypted, [the only datapoint exposed to third parties is the requested domain](https://gemfury.com/help/url-string-over-https), not what content you're requesting from the server.[^url]

Typically, when you make a request to a website, the first step is to convert the human-readable domain name (e.g., `example.com`) to a computer-readable IP address (e.g, `93.184.216.34`) by querying your internet provider's domain server. Think of it like checking the yellow pages for a company's phone number. But if you're the internet provider, there's no reason you can't instruct your domain server to return no IP address, making it look like the requested domain simply doesn't exist, or worse, to return a malicious site in its place.

If you want to block a particular piece of content, say a blog post on WordPress.com, your only choice is to poison the DNS entry to block the entire site, as there's no way to know if the user's request is for objectionable or innocuous content. This forces a baby-with-the-bathwater choice and is exactly how most internet censorship is implemented today, at least on the state level.[^disclaimer]

You've probably seen the [now-famous Google DNS graffiti](http://mashable.com/2014/03/21/twitter-ban-turkey-graffiti/) when Turkey banned Twitter earlier this year. By instructing your computer to use a public DNS server, rather than your internet service provider's, that domain look up, the weak link in the request, instead goes to a third-party beyond the state's control, and the website becomes accessible again.[^armsrace]

HTTPS ensures not only the privacy of the content you request, but also, protects the fact that you've requested it. HTTPS isn't just for online banking and ecommerce. HTTPS is for any website that adds to the public dialog, whether it's political commentary, how to contact a government official, or just a personal blog. If you run a website, especially a government website, even if you never process "sensitive" requests, consider adding HTTPS support and enforcing HTTPs by default.

HTTPS is about more than keeping things hidden. It's about keeping things seen.

[^armsrace]: While it's possible to block external DNS entirely, or to block certain IPs, this is exponentially more complex for for-profit, privately owned ISPs to implement, quickly becomes a game of whack-a-mole, and will almost undoubtedly be over inclusive, especially where CDNs or shared hosting is involved.

[^injection]: See, e.g., [Comcast injecting ads](http://arstechnica.com/tech-policy/2014/09/why-comcasts-javascript-ad-injections-threaten-security-net-neutrality/), [Verizon tracking mobile customers](https://www.eff.org/deeplinks/2014/11/verizon-x-uidh), and [spy agencies scrapping Angry Birds for personal data](https://www.propublica.org/article/spy-agencies-probe-angry-birds-and-other-apps-for-personal-data).

[^url]: For example, without HTTPS, an eavesdropper would see that you were reading `ben.balter.com/2015/01/02/https-all-the-things/`. With HTTPS, all they'd see is that you made an encrypted request to `ben.balter.com`.

[^disclaimer]: Obviously, a country should have the right to enforce its own social norms, but when such technical implementations are trivial to bypass, by even non-techincal users switching protocols, DNS servers, or routign traffic through a proxy or VPN, such ends may be better accomplished by non-technical means.
