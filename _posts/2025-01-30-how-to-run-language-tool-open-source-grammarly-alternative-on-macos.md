---
title: How to run LanguageTool on macOS
description: How to set up a free and open-source grammar, style, and spell checker that can be run locally on your machine without sending data to a third-party services like Grammarly, preserving the privacy of what you type.
---

You may be familiar with grammar checking tools like Gramarly,[^grammarly] but if you're privacy-conscious like me, you likely don't want to send everything you type to a third-party service (or may be prohibited from doing so by your employer). Enter [LanguageTool](https://languagetool.org/), a free and open-source grammar, style, and spell checker that can be run locally on your machine, so nothing you type ever leaves your computer. LanguageTool can be used with your browser, with VS Code,[^vscode] and with Slack and other common applications. For those looking to run LanguageTool like this, I've tried a number of ways, and here's the easiest:

## Set up the local server

First you need to install the backend server, which is a Java application. You could do this manually or via Docker (trust me, I tried both with varying levels of success), but I recommend letting Homebrew do the heavy lifting for you.[^homebrew] Homebrew creates its own `languagetool-server` executable that wraps the LanguageTool jar around the Homebrew-maintained Java runtime, saving you from having to manage a Java environment yourself. In theory, it "just works". Here's how to install and run it:

1. `brew install languagetool`
2. `brew services start languagetool`

This will install the LanguageTool server and set it to start automatically on boot as a Homebrew-managed service. Once you have the server running, you can use LanguageTool in your browser, in Slack, VS Code, etc. Read on for how to set up each (you can pick and choose once you've installed the server).

Note: If you'd like to test that the server is running at this point, you can run `curl --data "language=en-US&text=a simple test" http://localhost:8081/v2/check`.

### One potential gotcha

If you previously installed the `languagetool` cask,[^disambiguation] or accidentally installed it first, installing the non-cask version will likely fail to set up the backend service, due to the namespace conflict. The `install` command itself won't fail, but you'll see a "missing path" error in the installation output and the service will not be running. If so, here's how to fix it:

1. `brew uninstall languagetool --cask`
2. `brew reinstall languagetool`
3. `brew services start languagetool`
4. Optionally reinstall the frontend (see below)

## LanguageTool in your browser (Chrome, Edge, Firefox)

LanguageTool works great in your browser for any text box, Google Doc, GitHub issue, etc. Here's how to set it up:

1. Install the LanguageTool extension for your browser - [Chrome](https://languagetool.org/chrome/), [Edge](https://microsoftedge.microsoft.com/addons/detail/ai-grammar-checker-para/hfjadhjooeceemgojogkhlppanjkbobc), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/languagetool/)
2. In the extension settings, set the "API Server URL" to "Local server".

That last step is important because the extension defaults to using the public LanguageTool server, which is not the one you just installed.

## LanguageTool in Slack and other common work applications

LanguageTool also has a macOS-native frontend that provides support for Slack, Mail, Word, and other common work applications. Here's how to install it:

1. `brew install languagetool --cask`
2. Launch the app from the Applications folder
3. Open the LanguageTool settings via the menubar icon (LT icon > Gear icon > Settings)
4. Under "Advanced", set the "API Server URL" to "Local server" (again, otherwise it will default to the public server)
5. Under "Active apps", enable LanguageTool for Slack, etc.

## LanguageTool in VS Code

1. Install [the extension](https://marketplace.visualstudio.com/items?itemName=davidlday.languagetool-linter).
2. It just works!

## LanguageTool in Safari

Safari does not allow extensions to make calls from HTTPS pages to HTTP endpoints (the local server), meaning before we can use the Safari LanguageTool extension, we'll need to set up an HTTPS proxy so that it will work on HTTPS websites. Here's an easy way to do that:

1. `brew install caddy`

2. Create a `/opt/homebrew/etc/Caddyfile` file with the following contents:

   ```caddyfile
   localhost:8082
   reverse_proxy :8081
   ```

3. `brew services start caddy`. Note: You will be asked to `sudo` as Caddy creates a locally trusted certificate.

4. Install [the Safari extension](https://apps.apple.com/us/app/languagetool-grammar-checker/id1534275760)

5. In the Safari extension, for "API Server URL" choose "Other server" and enter `https://localhost:8082/v2`.

This will set up a reverse proxy that listens on port `8082` and forwards requests to the local LanguageTool server. If you'd like to test that the server and proxy are running you can run `curl --data "language=en-US&text=a simple test" https://localhost:8082/v2/check`

## N-grams

As a bonus, you can set up n-gram data sets to improve LanguageTool's ability to detect errors with words that are often confused:

> LanguageTool can make use of large n-gram data sets to detect errors with words that are often confused, like their and there.

It's a large download, but it's worth it if you have the space and are going to be using LanguageTool a lot. Here's how to set it up:

1. [Download](http://languagetool.org/download/ngram-data/) the n-gram dataset(s) for your language(s) onto your local machine and unzip them into a local n-gram's directory. I recommend `~/ngrams`, but you can install it anywhere. (Note: the data is language specific, so unzip the download to, e.g., `~/ngrams/en`).
2. Edit `/opt/homebrew/etc/languagetool/server.properties`, adding `languageModel=/users/benbalter/ngrams`, replacing the path to the absolute path of where you downloaded and unzipped the n-gram data.
3. Restart the service: `brew services restart languagetool`

If you did it correctly, again, it should "just work", but if you want to confirm, you should see a message in the logs that says `INFO: Using n-gram data from /users/benbalter/ngrams` (or whatever path you used).

## Troubleshooting

By default, LanguageTool logs live in: `/opt/homebrew/var/log/languagetool/languagetool-server.log` and Caddy logs live in: `/opt/homebrew/var/log/caddy.log`. If you want to see if LanguageTool is running, you can use `brew services list`, or try one of the `cURL` methods mentioned earlier.

## Taking it a step further

If you *really* want to make sure what you type doesn't traverse the internet, you can modify your hosts file or use another method (like firewall rules or Little Snitch) to block the public LanguageTool server (`api.languagetool.org`) at the network level. This way, if you accidentally forget to set the "API Server URL" to "Local server" in one of the clients, the request will fail, and you'll know that the client is not using the local server.

## Conclusion

That's it! You now have a powerful, privacy-respecting grammar checker that you can use in your browser, in Slack, in VS Code, and in other common work applications. Happy writing!

[^disambiguation]: The non-cask version is the backend Java server. The cask version (by the same name) is the macOS frontend that provides a menubar icon and settings UI.

[^homebrew]: If you're not familiar with Homebrew, it's a macOS package manager that makes it easy to install, manage, and update command-line software. If you don't have it installed, you can do so by running the following command: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`.

[^grammarly]: Nothing against Grammarly. It's a great product. I prefer to use open source tools whenever I can.

[^vscode]: I used the VS Code extension to write this post, so I *really* hope there aren't any typos.
