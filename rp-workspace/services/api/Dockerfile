# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files (context is workspace root)
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy API package files
COPY apps/api/package*.json ./apps/api/

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY apps/api/ ./apps/api/

# Set working directory to API
WORKDIR /app/apps/api

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Copy package files
COPY apps/api/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/apps/api/dist ./dist

# Create logs directory, non-root user and set ownership
RUN mkdir -p logs && \
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
