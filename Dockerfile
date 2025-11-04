FROM archlinux:latest

WORKDIR /usr/src/app

RUN pacman -Sy --noconfirm nodejs-lts-jod npm
RUN pacman -S --noconfirm chromium
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8000
CMD ["node", "server.js"]
