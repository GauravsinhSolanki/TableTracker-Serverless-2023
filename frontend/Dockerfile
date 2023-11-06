# Stage 1: Build the React application
FROM node:18-alpine3.17 AS build

# Set the working directory in the builder stage
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to work directory
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend code into the container
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the React application from Nginx
FROM nginx:stable-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]
