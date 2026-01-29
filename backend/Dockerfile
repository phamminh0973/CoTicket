# Development Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm install

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

# Dev mode with hot reload
CMD ["npm", "run", "dev"]
