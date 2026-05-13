FROM node:22-alpine AS build

WORKDIR /app

# Bắt buộc phải copy cả package-lock.json
COPY package.json package-lock.json ./

# Cài dependency chính xác theo lock file
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build app
RUN npm run build:production

# Serve bằng "serve"
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app/dist /app/dist

RUN npm install -g serve

EXPOSE 8000

CMD ["serve", "-s", "dist", "-l", "8000"]

