# Setup Guide - Insight Application

Complete step-by-step instructions to get Insight running on your machine.

## Prerequisites

Before starting, ensure you have:
- **Node.js 16+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free account)
- **Git** (to clone the repository)

Check your installation:
```bash
node --version    # Should show v16.0.0 or higher
npm --version     # Should show 8.0.0 or higher
git --version     # Should show git version 2.x.x
```

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Insight
```

---

## Step 2: Configure Environment Variables

### Backend Configuration

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a `.env` file:
   ```bash
   # Copy the example (create if doesn't exist)
   ```

3. Add the following environment variables to `server/.env`:

   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/insight
   
   # JWT Secrets (use strong random strings in production)
   JWT_SECRET=your_jwt_secret_key_change_this
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_change_this
   
   # Server Port
   PORT=5050
   
   # CORS Configuration
   WHITELISTED_DOMAINS=http://localhost:5173
   
   # Node Environment
   NODE_ENV=development
   ```

   **Configuration Explained:**
   - `MONGODB_URI`: Your database connection string
     - Local: `mongodb://localhost:27017/insight`
     - Atlas: `mongodb+srv://user:password@cluster.mongodb.net/insight`
   - `JWT_SECRET`: Random string used to sign authentication tokens
   - `WHITELISTED_DOMAINS`: Comma-separated list of allowed frontend origins
   - `NODE_ENV`: Set to `development` for detailed logging

### Frontend Configuration

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. The frontend typically uses `http://localhost:5050` as the API base URL. If you need to customize:
   - Check `src/main.jsx` or API service files for the backend URL
   - Update if necessary for your setup

---

## Step 3: Setup MongoDB

### Option A: Local MongoDB

1. **Install MongoDB Community Edition** ([Guide](https://docs.mongodb.com/manual/installation/))

2. **Start MongoDB:**
   
   **On Windows (PowerShell):**
   ```powershell
   # If installed via MSI
   net start MongoDB
   
   # Or if you have mongod.exe path
   mongod
   ```
   
   **On Mac/Linux:**
   ```bash
   brew services start mongodb-community
   # or
   mongod
   ```

3. **Verify it's running:**
   ```bash
   mongo  # or mongosh for newer versions
   ```
   You should see a MongoDB shell prompt.

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster
4. Get your connection string: `mongodb+srv://user:password@cluster.mongodb.net/insight`
5. Add your connection string to `server/.env` as `MONGODB_URI`
6. In Atlas, add your IP to the IP Whitelist (or allow `0.0.0.0/0` for development)

---

## Step 4: Install Backend Dependencies

From the `server` directory:

```bash
npm install
```

This installs packages defined in `package.json`. Expected packages:
- `express` - Web framework
- `mongoose` - MongoDB connection
- `passport.js` - Authentication
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing
- `cors` - Cross-origin requests
- `cookie-parser` - Cookie handling

---

## Step 5: Start the Backend Server

From the `server` directory:

```bash
npm start
```

**Expected output:**
```
Server running on port 5050
MongoDB connected to mongodb://localhost:27017/insight
```

If you see errors:
- **"Cannot find module"** → Run `npm install` again
- **"Connection refused"** → MongoDB isn't running, see Step 3
- **"EADDRINUSE"** → Port 5050 is already in use, change `PORT` in `.env`

Leave this terminal running.

---

## Step 6: Install Frontend Dependencies

Open a **new terminal** and navigate to the client directory:

```bash
cd client
npm install
```

This installs React, Vite, Tailwind CSS, and other frontend dependencies.

---

## Step 7: Start the Frontend Development Server

From the `client` directory:

```bash
npm run dev
```

**Expected output:**
```
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## Step 8: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the Insight application home page.

---

## Step 9: Test the Setup

### Test User Registration:
1. Click "Sign Up"
2. Enter an email, username, and password
3. Click "Create Account"
4. You should be logged in and redirected to the dashboard

### Check the Console:
- **Browser DevTools** (F12 → Console): Look for any JavaScript errors
- **Backend Terminal**: Look for logs showing your requests

### If you see a 401 error:
- Make sure your token is being saved in localStorage/sessionStorage
- Check that the `Authorization` header is being sent
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
