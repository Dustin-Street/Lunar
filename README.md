# Lunar

Lunar is a full-stack journaling application built to practice and demonstrate web development fundamentals. It lets users create journals, write entries with mood labels, and review basic activity statistics.

**Live application:** [https://lunar-xycw.onrender.com](https://lunar-xycw.onrender.com)

The hosted application runs on Render's free tier and may take a little while to respond after being idle.

## Features

- Create an account, sign in, refresh authentication, and recover an account
- Create, edit, view, and delete journals and journal entries
- Add a mood to journal entries
- View activity statistics, including monthly entry count, most common day, and most common mood
- Use a responsive React interface

## Screenshots

### Desktop

![Lunar desktop login screen](docs/assets/images/LunarLoginFull.png)

### Mobile

![Lunar mobile login screen](docs/assets/images/LunarLoginSmall.png)

## Technology

### Client

- React 19
- React Router
- Vite
- Tailwind CSS
- Axios

### Server

- Node.js and Express
- MongoDB with Mongoose
- Passport, JSON Web Tokens, and bcrypt
- Express Validator, Helmet, CORS, and Express Rate Limit
- Sentry for error monitoring

## Run locally

### Requirements

- Node.js 20.6 or newer (the startup command uses Node's `--env-file` option)
- npm
- A MongoDB database, such as MongoDB Atlas

### Configure the server

Create `server/.env` and add the server's configuration. The database connection reads `ATLAS_URI`.

```env
ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-another-long-random-secret
REFRESH_TOKEN_EXPIRY=2592000
SESSION_EXPIRY=900
JWT_TOKEN_EXPIRY=900
COOKIE_SECRET=replace-with-a-long-random-secret
WHITELISTED_DOMAINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:5050
PORT=5050
```

Replace the example values with your own. Keep secrets and database credentials private; do not commit `.env` files.

### Install dependencies and start the server

```powershell
cd server
npm install
node --env-file=.env server.js
```

### Configure and start the client

Create `client/.env` with the URL of the local API:

```env
VITE_API_URL=http://localhost:5050
```

Then run the client in a separate terminal:

```powershell
cd client
npm install
npm run dev
```

Open the local address printed by Vite (usually `http://localhost:5173`).

## Available scripts

Run client commands from `client/`:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run security-audit
```

Run the server with `node --env-file=.env server.js` from `server/`. Its `npm test` script is currently a placeholder; the project does not yet have an automated test suite.

## Project structure

```text
client/
  src/components/    React pages and UI components
  src/hooks/         Shared client-side data and state logic
  src/utils/         Client utilities
server/
  authentication/    Authentication strategies and token helpers
  database/          Database connection
  middleware/        Express middleware
  routes/            API routes
  schema/            Mongoose models
  utils/             Server utilities
docs/                Setup, API, troubleshooting, and error-handling guides
```

## Security note

The project includes authentication, password hashing, HTTP-only refresh-token cookies, request validation, rate limiting, CORS configuration, security headers, and MongoDB input sanitization. These measures are part of a learning project and are not a substitute for a professional security review. Do not use the application to store sensitive personal information.

## Documentation

- [Setup guide](docs/SETUP.md)
- [API reference](docs/API.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Error handling](docs/ERROR_HANDLING.md)

Lunar was built as a personal project for learning and reflection.
