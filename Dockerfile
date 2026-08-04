# multi-stage build base -> deps -> runtime
# use alpine as minimal linux distro (faster pull, smaller attack surface, musl libc)
# COPY: caching optimization, reuse if packages dont change
# EXPOSE: only documents that this port is exposed, must still need to publish the port when running the container

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
