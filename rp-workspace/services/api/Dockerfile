# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files first (for better layer caching)
# These are needed for monorepo dependency resolution
COPY package*.json ./
COPY package-lock.json* ./
COPY tsconfig.base.json ./

# Copy API package files
COPY apps/api/package*.json ./apps/api/
COPY apps/api/package-lock.json* ./apps/api/

# Install root dependencies first (including dev dependencies for build)
# Use npm install as fallback if package-lock.json is out of sync
RUN npm ci || npm install

# Install API dependencies (npm will use parent node_modules when possible)
# Use npm install as fallback if package-lock.json is out of sync
WORKDIR /app/apps/api
RUN npm ci || npm install

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

# Copy API package files and lock file
COPY apps/api/package*.json ./
COPY apps/api/package-lock.json* ./

# Install only API production dependencies
# All dependencies will be in /app/node_modules where the app runs
RUN npm ci --omit=dev || npm install --omit=dev

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
