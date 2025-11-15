# Use the same Ruby base image as before
FROM mcr.microsoft.com/devcontainers/ruby:1-3.3-bookworm

# Pre-install system dependencies required for Google Chrome
# This significantly speeds up container creation by having dependencies cached in the image
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
        # Chrome/Chromium dependencies
        libnss3 \
        libnspr4 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libdbus-1-3 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libpango-1.0-0 \
        libcairo2 \
        libasound2 \
        libatspi2.0-0 \
        libxshmfence1 \
        # Additional required libraries
        fonts-liberation \
        libappindicator3-1 \
        libgbm-dev \
        xdg-utils \
        # Font packages for international support
        fonts-ipafont-gothic \
        fonts-wqy-zenhei \
        fonts-thai-tlwg \
        fonts-khmeros \
        fonts-kacst \
        fonts-freefont-ttf \
        libxss1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
