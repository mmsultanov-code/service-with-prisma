FROM node:20-alpine

# Установка инструментов для сборки нативных модулей
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Копируем package.json для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Устанавливаем порты
EXPOSE 3000

# Устанавливаем команду запуска
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
