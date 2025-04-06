# Use Node.js as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --ignore-scripts

# Copy all frontend files
COPY . .

# Start the React app
CMD ["yarn", "dev"]
