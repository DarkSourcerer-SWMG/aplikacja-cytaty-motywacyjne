# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL and other dependencies
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main"]
