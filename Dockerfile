# 1. Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure Linux execute permissions on binaries
RUN chmod -R +x node_modules/.bin || true

# Set default backend API URL pointing to the live Railway backend
ARG VITE_API_BASE_URL=https://backendtt-production-551c.up.railway.app/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# 2. Production serving stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

# Start static file server on Railway's dynamic PORT with SPA routing support
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
