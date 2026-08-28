FROM node:24-alpine AS builder

WORKDIR /app

ARG VITE_BACKEND_HOST="http://localhost:3000"
ENV VITE_BACKEND_HOST=${VITE_BACKEND_HOST}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS production

COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
