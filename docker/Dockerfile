# Multi-stage build for React/Vite application
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with cache optimization
RUN npm ci

# Copy source code
COPY . .

# Build the application for container environment
RUN npm run build

# Production stage: use Node + Vite preview to serve built assets
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy built assets
COPY --from=build /app/dist ./dist

# Install a tiny static server if necessary or use Vite preview via npm script
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Start Vite preview server (expects package.json scripts.preview to exist)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]