FROM node:lts as build

WORKDIR /app

# Copy package.json and install dependencies
COPY ./package*.json ./
RUN npm install

# Bundle app source inside the Docker image
COPY ./ ./
RUN npm run build

# Use nginx to serve the static content
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]