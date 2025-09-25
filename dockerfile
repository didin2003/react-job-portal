# Step 1: Build React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Build React app
RUN npm run build

# Step 2: Build Backend with Express
FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install --production

# Copy backend source code
COPY backend/ ./

# Copy built frontend into backend's public folder
COPY --from=frontend-builder /app/frontend/ ./public

# Expose the port your Express app listens on
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]
