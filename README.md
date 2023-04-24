# hinder

## Running frontend

1. Install npm/pnpm
2. Install yarn
3. `cd frontend`
4. `yarn/pnpm install`
5. `yarn/pnpm run dev`

## Running backend

1. Install mysql
2. Run mysql
3. Create backend/.env file with mysql data, example:

```
TOKEN_SECRET_KEY=very_secretave
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootroot
DB_NAME=hinder
PORT=5000
```

4. `cd backend`
5. `yarn install`
6. `yarn watch-ts` in first terminal (this will compile ts files to js on save)
7. `yarn serve` in second terminal (this will run your compiled js files)

Edit entity files to change database structure. All entities sync after running `yarn serve`
