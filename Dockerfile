FROM node:16 AS build

WORKDIR /sdp3

COPY ./frontend/package*.json ./

RUN npm install

COPY ./frontend/ ./

RUN npm run build

FROM nginx:1.19
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /sdp3/dist /usr/share/nginx/html
