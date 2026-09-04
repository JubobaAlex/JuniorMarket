# JuniorMarket

Fullstack marketplace приложение, разработанное на **Next.js + NestJS**.

Пользователь может зарегистрироваться, выбрать роль покупателя или продавца, просматривать товары, искать их, добавлять товары в корзину и управлять своим профилем.

## Стек

### Frontend

* Next.js
* React
* TypeScript
* Redux Toolkit
* Tailwind CSS
* Feature-Sliced Design

### Backend

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT
* Swagger

### Database

* PostgreSQL
* Neon

## Возможности

### Авторизация

* Регистрация
* Авторизация
* Выход из аккаунта
* Получение текущего пользователя
* JWT-аутентификация
* Разделение пользователей по ролям

### Товары

* Просмотр списка товаров
* Создание товара
* Удаление товара
* Поиск товаров
* Infinite Scroll

### Корзина

* Добавление товара в корзину
* Изменение количества товара
* Удаление товара из корзины
* Получение корзины текущего пользователя
* У каждого пользователя своя корзина

### Профиль

* Просмотр профиля пользователя
* Информация о пользователе
* Работа с данными авторизованного пользователя

## API

Основные endpoints backend:

### Auth

```text
POST /auth/register
POST /auth/login
GET  /auth/me
POST /auth/logout
```

### Products

```text
GET    /products
GET    /products/:id
POST   /products
PATCH  /products/:id
DELETE /products/:id
```

### Cart

```text
GET    /cart
POST   /cart/items
PATCH  /cart/items/:productId
DELETE /cart/items/:productId
```

## Локальный запуск

### 1. Клонирование

```bash
git clone <repository-url>
cd JuniorMarket
```

### 2. Backend

```bash
cd server
npm install
```

Создайте `.env`:

```env
DATABASE_URL="your-postgresql-url"
JWT_SECRET="your-secret"
```

Запустите Prisma:

```bash
npx prisma generate
npx prisma migrate dev
```

Запустите сервер:

```bash
npm run start:dev
```

### 3. Frontend

```bash
cd client
npm install
```

Создайте `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

Запустите frontend:

```bash
npm run dev
```

После запуска приложение будет доступно по адресу:

```text
http://localhost:3001
```

## Переменные окружения

### Frontend

```env
NEXT_PUBLIC_API_URL=
```

### Backend

```env
DATABASE_URL=
JWT_SECRET=
```

## Swagger

После запуска backend документация API доступна через Swagger:

```text
/api
```

Swagger позволяет протестировать endpoints авторизации, товаров и корзины.

## Основные технологии

```text
Next.js
React
TypeScript
Redux Toolkit
Tailwind CSS
NestJS
Prisma
PostgreSQL
JWT
Swagger
Neon
```
## Автор:JubobaAlex
