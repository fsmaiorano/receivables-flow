FROM node:20-bullseye AS base

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the app
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Generate Prisma client with correct binaries
RUN npx prisma generate

RUN pnpm build

# Production image
FROM base AS runner
ENV NODE_ENV production

# Install OpenSSL for Prisma in the final image
RUN apt-get update -y && apt-get install -y openssl

# Copy necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/.env.production ./.env.production

# Create db directory structure for SQLite
RUN mkdir -p /app/prisma/db

# Expose port
EXPOSE 3000

# Set environment variables explicitly
ENV DATABASE_URL="file:/app/prisma/db/production.db"

# Start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]