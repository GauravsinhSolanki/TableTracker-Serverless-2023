FROM node:16 AS build

WORKDIR /sdp3-admin

COPY ./frontend-admin/package*.json ./

RUN npm install

COPY ./frontend-admin/ ./

RUN npm run build

FROM nginx:1.19
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /sdp3-admin/dist /usr/share/nginx/html
