FROM node:14-apline as BUILD_IMAGE
RUN apk update && apk add yarn curl bash python g++ make && rm -rf /var/cache/apk/*

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /app
COPY package-lock.json ./
COPY --chown=node:node

RUN npm ci
RUN npm run build
RUN npm prune --production
RUN /usr/local/bin/node-prune

FROM node:14-alpine
WORKDIR /app
COPY --from=BUILD_IMAGE /app/dist ./dist
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY package.json ./

CMD ["node", "dist"]

