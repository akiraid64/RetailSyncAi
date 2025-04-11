# Use the official Node.js 20 image as a base (exactly like Replit's environment)
FROM node:20-slim

# Set working directory (in Replit, code runs from the root directory)
WORKDIR /home/runner

# Install necessary build tools and dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies exactly as they would be in Replit
RUN npm ci

# Copy all files
COPY . .

# No need to set OPENAI_API_KEY as it's hardcoded in the application
ENV NODE_ENV=development
ENV PORT=5000
ENV HOSTNAME="0.0.0.0"

# Expose port 5000
EXPOSE 5000

# Command to run the application (matches Replit's workflow)
CMD ["npm", "run", "dev"]