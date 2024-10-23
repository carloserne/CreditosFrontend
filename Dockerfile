# Use a specific version of Node.js for stability (LTS version recommended)
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json separately to leverage Docker cache
COPY package*.json ./

# Install dependencies with npm, avoiding deprecated packages where possible
# Using --legacy-peer-deps to address dependency conflicts
RUN npm install --legacy-peer-deps

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the application code
COPY . .

# Build the Angular application in production mode
RUN ng build --configuration=production

# Use nginx to serve the application in production
FROM nginx:alpine

# Copy the built Angular app from the previous stage
COPY --from=build /usr/src/app/dist/creditos-front-end /usr/share/nginx/html

# Expose port 80 for nginx
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]