# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy workspace configuration and lock file from monorepo root
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy package.json files for all workspaces
COPY apps/server/package.json ./apps/server/
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/

# Copy Prisma schema (needed for postinstall script during pnpm install)
COPY packages/database/prisma ./packages/database/prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules

# Copy all source code
COPY . .

# Generate Prisma client
RUN pnpm --filter @flagout/database generate

# Build the Fastify server
RUN pnpm --filter @flagout/server build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fastify

# Copy built output and dependencies
COPY --from=builder --chown=fastify:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=fastify:nodejs /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=builder --chown=fastify:nodejs /app/packages/database ./packages/database
COPY --from=builder --chown=fastify:nodejs /app/node_modules ./node_modules

USER fastify

EXPOSE 3001

ENV PORT=3001

CMD ["node", "apps/server/dist/index.js"]
