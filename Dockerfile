FROM node:current-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

FROM node:current-alpine

WORKDIR /app

# Install only production dependencies to reduce image size
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.production ./.env.production

# Create db directory structure for SQLite with proper permissions
RUN mkdir -p /app/data && chown -R node:node /app/data
USER node

# Expose port
EXPOSE 3000

# Set environment variables explicitly
ENV NODE_ENV="production"
# DATABASE_URL will be supplied by docker-compose

# Set non-root user for better security
USER node

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start the app
CMD ["node", "dist/main"]