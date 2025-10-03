# Multi-stage build for React/Vite application
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with cache optimization
RUN npm ci

# Supprimer le dossier dist avant le build pour garantir que les variables d'environnement sont bien prises en compte
RUN rm -rf dist

# Install curl for connectivity testing
RUN apk add --no-cache curl

# Copy source code
COPY . .

# Arguments de build pour les variables d'environnement Vite
ARG VITE_API_URL=http://lottosylvain-backend:8090/
ARG VITE_ENVIRONMENT=container

# Export en variables d'environnement pour le build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_ENVIRONMENT=${VITE_ENVIRONMENT}

# Build the application for container environment
RUN npm run build

# Production stage: use Node + Vite preview to serve built assets
FROM node:22-alpine

# Install curl for network testing in final container
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy built assets
# Copy built assets and package.json needed for preview
# Copy built assets and package files needed for preview
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
# Install production dependencies (Vite must be in dependencies)
RUN npm ci --omit=dev

# Install a tiny static server if necessary or use Vite preview via npm script
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Install a tiny static server and serve built assets from /app/dist
RUN npm install -g serve --no-audit --no-fund || true

# Start Vite preview server (expects package.json scripts.preview to exist)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]