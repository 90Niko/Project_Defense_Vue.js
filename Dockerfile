# Step 1: Use a Node.js image to build the Vue.js app
FROM node:16-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vue.js application
RUN npm run build

# Step 2: Use a lightweight web server to serve the built files
FROM nginx:stable-alpine

# Copy the built files from the build stage to the nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
