# Use official Playwright image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project
COPY . .

# Create necessary directories for outputs
RUN mkdir -p logs allure-results allure-report playwright-report test-results

# Set environment variable for CI
ENV CI=true

# Default command - run API tests
CMD ["npm", "run", "test:api"]
