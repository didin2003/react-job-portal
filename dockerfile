# 1. Build React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# 2. Build backend and serve frontend
FROM node:20-alpine
WORKDIR /app

# Copy backend dependencies and code
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy frontend build to backend public directory
COPY --from=frontend-builder /frontend/dist ./public

# Expose the port your Express app listens on
EXPOSE 5000

# Start the backend server with static frontend serving
CMD ["node", "server.docker.js"]
