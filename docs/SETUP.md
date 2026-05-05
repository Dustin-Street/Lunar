# Setup Guide - Insight Application

Complete step-by-step instructions to get Insight running on your machine.

## Prerequisites

Before starting, ensure you have:
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free account)
- **Git** (to clone the repository)

Check your installation:
```bash
node --version    # Should show v18.0.0 or higher
npm --version     # Should show 8.0.0 or higher
git --version     # Should show git version 2.x.x
```

---

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Insight
```

### 2. Environment Setup

#### Backend Configuration

```bash
cd server
# Create environment file
cp .env.example .env
```

** BACKEND ENV STRUCTURE **
Edit `server/.env` with your configuration:

```env

MONGODB_URI=Your mongoDB URI local or Atlas
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY= 60 * 60 * 24 * 30 //<- 30 days for refresh token experation
JWT_TOKEN_EXPIRY = 900 //<- 15 minutes populates the front-end
SESSION_EXPIRY= 60 * 15 //<- 15 minutes used in the server
SESSION_SECRET=StrongRandomString
COOKIE_SECRET=StrongrandomString

WHITELISTED_DOMAINS=http://localhost:5173 //<- if you keep these consistent you can change these as the application uses thse strings
FRONTEND_URL=http://localhost:5173
PORT=5050
API_URL=http://localhost:5050


```

**FRONTEND ENV STRUCTURE **

``` env

VITE_API_URL=http://localhost:5050 <- or whatever port points to your server
SENTRY_ID=yourSentryURL

```

#### Database Setup

- **Local MongoDB**: Install and start MongoDB on your system
- **MongoDB Atlas**: Create a free cluster and get your connection string

### 3. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 4. Start the Application

#### Terminal 1: Backend Server

```bash
cd server : the server need to be passed the ENV I use node commmand below
node --env-file=EnvFileNameHere server.js - loads the server with that env file


```

Server will run on `http://localhost:5050`

#### Terminal 2: Frontend Development Server

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

### 5. Access the Application

Open your browser and navigate to `http://localhost:5173`
Or use the first terminal in Vite to Enter + o to run it in the browser

### 6. Test the Setup

### Test User Registration:
1. Click "Sign Up"
2. Enter an email, username, and password
3. Click "Create Account"
4. You should be logged in and redirected to the dashboard

### Check the Console:
- **Browser DevTools** (F12 → Console): Look for any JavaScript errors
- **Backend Terminal**: Look for logs showing your requests

### If you see a 401 error:
- Confirm your browser has an active refresh-token cookie (HttpOnly)
- Check that the `Authorization` header is being sent by the app
- See [Troubleshooting Guide](TROUBLESHOOTING.md)

---

## Verification Checklist

✅ Node.js and npm installed
✅ MongoDB running (local or Atlas)
✅ `server/.env` configured with database URL
✅ Backend dependencies installed (`npm install` in server/)
✅ Backend running on `http://localhost:5050` (see terminal)
✅ Frontend dependencies installed (`npm install` in client/)
✅ Frontend running on `http://localhost:5173` (see browser)
✅ Can see the Insight landing page
✅ Can create a new user account

---

## Stopping the Servers

**Frontend:**
- Press `Ctrl+C` in the terminal running `npm run dev`

**Backend:**
- Press `Ctrl+C` in the terminal running `npm start`

**MongoDB (if local):**
- Windows: `net stop MongoDB` or press `Ctrl+C` in mongod window
- Mac/Linux: `brew services stop mongodb-community`

---

## Next Steps

- Read [API Reference](API.md) to understand available endpoints
- Check [Troubleshooting Guide](TROUBLESHOOTING.md) if you run into issues
- Explore [Error Handling Guide](ERROR_HANDLING.md) to understand error responses

---

## Common Issues

**"MongooseServerSelectionError: connect ECONNREFUSED"**
- MongoDB isn't running. See Step 3 to start it.

**"CORS policy: blocked by CORS policy"**
- Your frontend URL isn't in `WHITELISTED_DOMAINS`. Update `server/.env`.

**"Cannot POST /api/user/createUser"**
- Backend routes might not be registered. Restart the backend server.

**"NetworkError when attempting to fetch resource"**
- Backend isn't running or URL is incorrect. Check port 5050 is open.

See [Troubleshooting Guide](TROUBLESHOOTING.md) for more solutions.
