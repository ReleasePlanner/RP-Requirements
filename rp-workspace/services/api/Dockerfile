# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files first (for better layer caching)
# These are needed for monorepo dependency resolution
COPY package*.json ./
COPY tsconfig.base.json ./

# Copy API package files
COPY apps/api/package*.json ./apps/api/

# Install root dependencies first (including dev dependencies for build)
RUN npm ci

# Install API dependencies (npm will use parent node_modules when possible)
WORKDIR /app/apps/api
RUN npm ci

# Copy API source code (this layer changes most frequently)
WORKDIR /app
COPY apps/api/ ./apps/api/

# Set working directory to API for build
WORKDIR /app/apps/api

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Copy root package files (needed for monorepo dependencies)
COPY package*.json ./

# Copy API package files
COPY apps/api/package*.json ./apps/api/

# Install root production dependencies first
# These will be available at /app/node_modules
RUN npm ci --only=production

# Install API production dependencies
# npm will hoist shared dependencies to /app/node_modules when possible
# For API-specific dependencies, they'll be in /app/apps/api/node_modules
# We set NODE_PATH to ensure both locations are searched
WORKDIR /app/apps/api
RUN npm ci --only=production

# Return to app root
WORKDIR /app

# Set NODE_PATH to include both root and API node_modules
# This ensures all dependencies are found when running from /app
ENV NODE_PATH=/app/node_modules:/app/apps/api/node_modules

# Copy built application from builder
COPY --from=builder /app/apps/api/dist ./dist

# Clean npm cache, create logs directory, non-root user and set ownership
RUN npm cache clean --force && \
    mkdir -p logs && \
    chmod 777 logs && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health/liveness', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set working directory back to app root for execution
WORKDIR /app

# Start application
CMD ["node", "dist/main"]
