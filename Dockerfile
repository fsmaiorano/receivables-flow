FROM node:current-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

FROM node:current-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.production ./.env.production
COPY docker-entrypoint.sh ./

RUN chmod +x /app/docker-entrypoint.sh

RUN mkdir -p /app/data && chown -R node:node /app/data

EXPOSE 3000

ENV NODE_ENV="production"
USER node

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

ENTRYPOINT ["/app/docker-entrypoint.sh"]

CMD ["node", "dist/main"]