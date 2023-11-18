FROM node:16 AS build

WORKDIR /sdp3-partner

COPY ./frontend-partner/package*.json ./

RUN npm install

COPY ./frontend-partner/ ./

RUN npm run build

FROM nginx:1.19
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /sdp3-partner/dist /usr/share/nginx/html
