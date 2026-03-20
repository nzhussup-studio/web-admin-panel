# Build Stage
FROM --platform=$BUILDPLATFORM node:18 AS build

WORKDIR /app

COPY package*.json ./

ARG NODE_OPTIONS=--max_old_space_size=4096
ARG VITE_API_BASE=http://localhost:8082
ARG VITE_KEYCLOAK_URL=http://localhost:8081
ARG VITE_KEYCLOAK_REALM=backend-auth-dev
ARG VITE_KEYCLOAK_CLIENT_ID=frontend-admin-auth-client
ENV NODE_OPTIONS=$NODE_OPTIONS
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID

RUN npm install

COPY . .

RUN npm run build

# Nginx Stage
FROM --platform=$TARGETPLATFORM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
