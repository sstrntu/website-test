# Multi-stage build for frontend
FROM node:18-alpine as build

# Set work directory
WORKDIR /app

# Copy package files first for better layer caching  
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application (when TypeScript migration is complete)
# RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine as production

# Copy built application from build stage (future)
# COPY --from=build /app/dist /usr/share/nginx/html

# For now, copy current HTML directly
COPY index.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Configure nginx for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]