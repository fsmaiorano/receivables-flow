FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env.production ./.env.production

# Create db directory structure for SQLite
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set environment variables explicitly
ENV DATABASE_URL="/app/data/production.db"
ENV NODE_ENV="production"

# Start the app
CMD ["node", "dist/main"]