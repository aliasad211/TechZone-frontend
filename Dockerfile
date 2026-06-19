# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy application source code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the production build with Nginx
FROM nginx:stable-alpine

# Copy build folder to Nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
