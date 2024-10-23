# Use a specific version of Node.js for stability (LTS version recommended)
FROM node:18-alpine

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

# Build the Angular project
# RUN ng build --configuration production

# Expose port 4200 for Angular
EXPOSE 4200

# Start the Angular application
CMD ["ng", "serve", "--port", "4200"]