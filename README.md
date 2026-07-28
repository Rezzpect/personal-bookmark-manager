# How to run
## Backend setup
```bash
cd backend
npm install
```
database setup (Please ensure you have DATABASE_URL in your backend .env before running these commands):
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```
Start the backend:
```bash
nest start
```

## Frontend setup
```bash
cd frontend
npm install
```
Start the frontend:

```bash
npm run dev
```

## .env file setup
backend .env file
```
DATABASE_URL="file:./dev.db"
AUTH0_ISSUER = {issuer from inside discovery endpoint}
AUTH0_AUTHORIZATION_URL = {authorization_endpoint from inside discovery endpoint}
AUTH0_TOKEN_URL = {token_endpoint from inside discovery endpoint}
AUTH0_JWKS_URL = {jwks_uri from inside discovery endpoint}

AUTH0_CLIENT_ID = {oauth tenant client id}
AUTH0_CALLBACK_URL = "http://localhost:{your backend port or 3000 in my case}/callback"
AUTH0_LOGOUT_URL = "http://localhost:{your backend port or 3000 in my case}"

APP_URL = "http://localhost:{your frontend port or 5173 in my case}"
```

frontend .env file
```
VITE_SERVICE_URL = "http://localhost:{your backend port or 3000 in my case}"
```

# What I did
Backend
- OIDC Authentication + PKCE
- Authguard to prevent unauthenticated user from calling Bookmarks and Collections API
- Create, Get list(Support filter by name), Get one, Update, Patch, Delete API endpoint for Collections
- Create, Get list(Support filter by collections), Get one, Update, Patch, Delete API endpoint for Collections
- create GET /collections/:id/bookmarks to get bookmarks that belong to the requested collections
- Prisma as ORM
- Prisma Seed file to creating seed data for 2 distinct users

Frontend
- create Collections Page with following feature
  - view list of the user's collections
  - create collections
  - delete collections
  - view bookmarks inside collections
  - copy collections and the bookmarks inside to clipboard
- create Bookmarks Page with following feature
  - view list of user's bookmarks
  - filter bookmarks based on collections
  - create bookmarks
  - delete bookmarks

# What I skipped
Frontend
- I skipped making editing bookmarks and collections mainly due to my Github Copilot tokens ran out and also because it would be easier to defend