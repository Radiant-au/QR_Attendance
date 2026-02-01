# ==================== BUILDER STAGE ====================
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (needed for build)
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Verify build
RUN ls -la dist/

# ==================== DEVELOPMENT ====================
FROM node:24-alpine AS dev

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port (for documentation)
EXPOSE ${PORT:-8000}
EXPOSE 9229

# Hot reload for development - NOW THIS RUNS nodemon src/index.ts
CMD ["npm", "run", "dev"]



# ==================== PRODUCTION ====================
FROM node:24-alpine AS prod

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy ONLY package files first
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production --omit=dev && \
    npm cache clean --force

# Copy built code from builder
COPY --from=builder /app/dist ./dist

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT:-8000}/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Expose port
EXPOSE ${PORT:-8000}

# Run the app
CMD ["node", "dist/index.js"]