# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files (context is workspace root)
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy Portal package files
COPY apps/portal/package*.json ./apps/portal/

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY apps/portal/ ./apps/portal/

# Set working directory to portal
WORKDIR /app/apps/portal

# Build Next.js application
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install wget for health checks and copy package files
RUN apk add --no-cache wget

# Copy package files
COPY apps/portal/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/apps/portal/.next ./.next
COPY --from=builder /app/apps/portal/public ./public
COPY --from=builder /app/apps/portal/next.config.ts ./next.config.ts
COPY --from=builder /app/apps/portal/tsconfig.json ./tsconfig.json
COPY --from=builder /app/apps/portal/package.json ./package.json
# Copy source files needed at runtime (for server components)
COPY --from=builder /app/apps/portal/src ./src

# Create non-root user and set ownership
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4200 || exit 1

# Start application
CMD ["npm", "start"]
