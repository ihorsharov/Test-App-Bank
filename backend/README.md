## Test Task

### Steps to run app

1. Create .env file in root folder and add such data:

```bash
PORT=3000
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=bankdb
DB_HOST=database
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}?schema=public
```

2. Run `docker-compose up`.

### Prisma scripts

1. npm run prisma:generate
2. npm run prisma:migrate

### Test scripts

1. npm run test
