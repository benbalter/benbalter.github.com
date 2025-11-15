# Use the same Ruby base image as before
FROM mcr.microsoft.com/devcontainers/ruby:latest

## Install Node.js (required for npx) and Playwright dependencies and browsers
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		ca-certificates \
		curl \
		# Node.js (LTS) setup
		gnupg \
		# Playwright system deps (Chromium, Firefox, WebKit)
		libasound2 \
		libatk1.0-0 \
		libatk-bridge2.0-0 \
		libatspi2.0-0 \
		libcairo2 \
		libcups2 \
		libdbus-1-3 \
		libdrm2 \
		libexpat1 \
		libfontconfig1 \
		libgbm1 \
		libglib2.0-0 \
		libgtk-3-0 \
		libnss3 \
		libpango-1.0-0 \
		libx11-6 \
		libx11-xcb1 \
		libxcb1 \
		libxcomposite1 \
		libxdamage1 \
		libxext6 \
		libxfixes3 \
		libxrandr2 \
		libxrender1 \
		libxshmfence1 \
		libxtst6 \
		xdg-utils \
		fonts-liberation \
		libu2f-udev \
		libvulkan1 \
		wget \
	&& curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /usr/share/keyrings/nodesource.gpg \
	&& echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list \
	&& apt-get update \
	&& apt-get install -y nodejs \
	&& rm -rf /var/lib/apt/lists/*

# Install Playwright browsers via npx (Node installed above)
RUN npx --yes playwright@latest install --with-deps


