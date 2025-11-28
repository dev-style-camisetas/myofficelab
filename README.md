# backend

npm i
npx prisma generate
npx prisma db push
npm run dev

# frontend

npm i
npm run dev

## Build Process

For development (hot reload, real-time changes):
```
  docker build -t auth_jwt:dev --target dev .
```

For production (compiled code, production-only dependencies):
```
docker build -t auth_jwt:prod --target prod .
docker run -p 3000:3000 auth_jwt:prod
```