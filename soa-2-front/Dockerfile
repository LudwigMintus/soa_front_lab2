# Используем Node.js для сборки приложения
FROM node:22 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем всё остальное и создаём сборку
COPY . .
RUN npm run build

# Используем Nginx для сервинга приложения
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
