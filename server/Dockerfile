# Use Node.js as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --ignore-scripts

# Copy all backend files
COPY . .

# Expose port 5000 for the backend
EXPOSE 5000

# Start the backend server
CMD ["yarn", "start"]
