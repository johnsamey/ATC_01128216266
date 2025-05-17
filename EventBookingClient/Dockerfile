# Stage 1: Build the Angular application
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build -- --configuration production

# # Stage 2: Serve the application with Nginx
# FROM nginx:alpine

# # Copy the built application from the build stage
# COPY --from=build /app/dist/event-booking-client /usr/share/nginx/html

# # Copy custom nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"] 