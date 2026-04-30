# Troubleshooting Guide - Insight Application

Solutions to common issues and problems when running or developing Insight.

## Table of Contents

1. [Setup Issues](#setup-issues)
2. [Authentication Errors](#authentication-errors)
3. [API & Network Errors](#api--network-errors)
4. [Database Issues](#database-issues)
5. [Frontend Issues](#frontend-issues)
6. [Debugging Techniques](#debugging-techniques)

---

## Setup Issues

### Issue: "npm: command not found"

**Cause:** Node.js/npm not installed or not in system PATH

**Solution:**

1. Install Node.js from [nodejs.org](https://nodejs.org/) (includes npm)
2. Restart your terminal
3. Verify: `node --version` and `npm --version`

---

### Issue: "Cannot find module 'express'" (or other module)

**Cause:** Dependencies not installed

**Solution:**

1. In the `server` directory, run:
   ```bash
   npm install
   ```
2. Check that `node_modules` folder was created
3. Try again: `npm start`

---

### Issue: "ENOENT: no such file or directory, open '.env'"

**Cause:** Environment file missing

**Solution:**

1. Create `server/.env` file
2. Add required variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/insight
   JWT_SECRET=your_secret_key
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   PORT=5050
   WHITELISTED_DOMAINS=http://localhost:5173
   NODE_ENV=development
   ```
3. Save and restart server

See [Setup Guide](SETUP.md#step-2-configure-environment-variables) for details.

---

## Authentication Errors

### Issue: 401 Unauthorized / Invalid Token

**Cause:** Token is missing, expired, or invalid

**Symptoms:**

- API calls return 401 status
- "Unauthorized" message in response
- Can't access protected endpoints

**Solutions:**

1. **Check request headers:**

   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

   - Token must be present
   - Format must be `Bearer <token>` (with space)

2. **Token is expired:**
   - Access tokens expire after 15 minutes
   - Call `/user/refreshToken` endpoint to get new token
   - Retry original request with new token

3. **Token format is wrong:**
   - Should be: `Authorization: Bearer <token>`
   - NOT: `Authorization: <token>`
   - NOT: `Bearer: <token>`

4. **Browser DevTools inspection:**
   - Open DevTools (F12)
   - Go to Network tab
   - Click failing request
   - Check Request Headers → Authorization header
   - Verify format is correct

**Debug Steps:**

```javascript
// In browser console
// Access tokens are stored in-memory in AuthContext in this app,

// console.log('Token:', token);
// console.log('Token length:', token?.length);
// console.log('Has Bearer prefix?', token?.startsWith('eyJ'));
```

---

### Issue: "Invalid credentials" on login

**Cause:** Email or password is incorrect

**Symptoms:**

- Login returns 401 status
- "Invalid credentials" error message

**Solutions:**

1. **Double-check credentials:**
   - Email must be exact (case-insensitive, but check for spaces)
   - Password is case-sensitive
   - Verify caps lock is off

2. **Account doesn't exist:**
   - Go to signup and create new account
   - Verify email doesn't already exist

3. **Special characters in password:**
   - If password has special chars, ensure JSON formatting:
     ```json
     {
       "email": "user@example.com",
       "password": "P@ss\"word"
     }
     ```

4. **Test in Postman:**

   ```bash
   POST http://localhost:5050/api/user/login
   Content-Type: application/json

   {
     "email": "test@example.com",
     "password": "testpassword123"
   }
   ```

---

### Issue: "A user with the given email is already registered"

**Cause:** Email already has an account

**Symptoms:**

- Signup returns 409 Conflict
- Can't create new account with that email

**Solution:**

1. Use a different email address, or
2. Login with existing credentials instead

**To reuse same email:**

- Delete the user from MongoDB directly
- Contact admin to reset the account

---

## API & Network Errors

### Issue: "CORS policy: blocked by CORS policy"

**Cause:** Frontend origin not whitelisted in backend CORS settings

**Symptoms:**

- Browser console shows CORS error
- Network tab shows request blocked
- API calls fail silently

**Example Error:**

```
Access to XMLHttpRequest at 'http://localhost:5050/api/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**

1. **Update `server/.env`:**

   ```env
   WHITELISTED_DOMAINS=http://localhost:5173,http://localhost:3000
   ```

   - Add your frontend URL
   - Separate multiple origins with comma
   - No spaces around comma

2. **Restart backend server:**

   ```bash
   npm start
   ```

3. **Clear browser cache:**
   - DevTools → Application → Clear Storage
   - Or use incognito mode

4. **Verify frontend URL matches exactly:**
   - If running on `http://127.0.0.1:5173`, add that too
   - Protocol, hostname, and port must match exactly

---

### Issue: "Cannot POST /api/user/createUser"

**Cause:** Route not registered or backend not running

**Symptoms:**

- 404 Not Found error
- "Cannot POST/GET /api/..." message

**Solutions:**

1. **Verify backend is running:**

   ```bash
   # In server directory
   npm start
   # Should show: "Server running on port 5050"
   ```

2. **Check correct base URL:**
   - Should be: `http://localhost:5050/api/user/createUser`
   - NOT: `http://localhost:5173/api/...` (frontend port)
   - NOT: `http://localhost:5050/user/createUser` (missing /api)

3. **Verify routes are imported:**
   - Check `server/server.js` has:
     ```javascript
     import userRoute from "./routes/user.js";
     app.use("/api/user", userRoute);
     ```

4. **Test with cURL:**
   ```bash
   curl http://localhost:5050/api/user/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test"}'
   ```

---

### Issue: "NetworkError when attempting to fetch resource"

**Cause:** Backend unreachable (not running, wrong port, or network issue)

**Symptoms:**

- "NetworkError" in browser console
- All API calls fail immediately
- No response from server

**Solutions:**

1. **Start the backend:**

   ```bash
   cd server
   npm start
   ```

2. **Verify backend is listening:**

   ```bash
   # From terminal, test if port 5050 is open
   # Windows PowerShell:
   Test-NetConnection localhost -Port 5050

   # Mac/Linux:
   lsof -i :5050
   ```

3. **Check if another service uses port 5050:**
   - Change `PORT` in `server/.env` to another port (e.g., 5051)
   - Update frontend API base URL to match

4. **Firewall issue:**
   - Ensure port 5050 isn't blocked by firewall
   - Windows: Check Windows Defender Firewall settings

5. **Wrong API URL in frontend:**
   - Check frontend code for hardcoded URLs
   - Should use environment variable or config file

---

## Database Issues

### Issue: "MongooseServerSelectionError: connect ECONNREFUSED"

**Cause:** MongoDB not running or connection string is wrong

**Symptoms:**

- Backend crashes on startup
- Error mentions "localhost:27017" or connection string
- "Failed to connect to MongoDB" message

**Solutions:**

1. **Start MongoDB (Local):**

   **Windows:**

   ```powershell
   # If installed via MSI
   net start MongoDB

   # Or run mongod directly
   mongod
   ```

   **Mac:**

   ```bash
   brew services start mongodb-community
   ```

   **Linux:**

   ```bash
   sudo systemctl start mongod
   ```

2. **Verify MongoDB is running:**

   ```bash
   mongo
   # or newer versions:
   mongosh
   ```

   - Should show MongoDB prompt

3. **Check connection string in `.env`:**

   ```env
   MONGODB_URI=mongodb://localhost:27017/insight
   ```

   - For local: `mongodb://localhost:27017/<database_name>`
   - For Atlas: `mongodb+srv://user:password@cluster.mongodb.net/insight`

4. **Atlas connection issues:**
   - Verify username and password are correct
   - Check IP whitelist: Add your IP or `0.0.0.0/0` for development
   - Ensure string format: `mongodb+srv://` not `mongodb://`

---

### Issue: "MongooseError: Schema hasn't been registered"

**Cause:** Model imported before schema defined, or missing model registration

**Symptoms:**

- Crashes when trying to query database
- Error mentions "Schema hasn't been registered"

**Solution:**

1. Verify `server/schema/` files export models correctly
2. Restart server: `npm start`
3. Check imports in route files match schema names

---

### Issue: Data not persisting in MongoDB

**Cause:** Data saved to wrong database or connection issue

**Symptoms:**

- Can create records, but they disappear on restart
- Can't retrieve previously created records

**Solutions:**

1. **Verify database name in connection string:**

   ```env
   MONGODB_URI=mongodb://localhost:27017/insight
   ```

   - All code must use same database name

2. **Check MongoDB actually saved the data:**

   ```bash
   # Connect to MongoDB
   mongo
   # List databases
   show dbs
   # Use your database
   use insight
   # Check collections
   show collections
   # Query documents
   db.users.find()
   ```

3. **Restart MongoDB to ensure persistence:**

   ```bash
   # Stop MongoDB
   mongod --shutdown
   # Or: net stop MongoDB (Windows)

   # Start again
   mongod
   ```

---

## Frontend Issues

### Issue: "Cannot read properties of undefined"

**Cause:** Trying to use data before it's loaded

**Symptoms:**

- JavaScript error in browser console
- Page crashes or shows broken content
- "Cannot read property 'X' of undefined"

**Solutions:**

1. **Check for data loading:**

   ```javascript
   // Bad: assumes data exists
   const userName = user.name;

   // Good: check first
   const userName = user?.name || "Guest";
   ```

2. **Verify API response structure:**
   - Open DevTools → Network tab
   - Check API response JSON
   - Ensure frontend expects correct structure

3. **Add loading state:**
   ```javascript
   if (isLoading) return <div>Loading...</div>;
   if (error) return <div>Error: {error}</div>;
   return <div>{data}</div>;
   ```

---

### Issue: Page won't load / shows blank screen

**Cause:** Frontend build error or missing dependencies

**Symptoms:**

- Browser shows blank page
- Console has red errors
- "Cannot find module" or syntax errors

**Solutions:**

1. **Clear browser cache:**
   - DevTools → Application → Clear Storage
   - Then refresh page (Ctrl+Shift+R hard refresh)

2. **Check frontend console for errors:**
   - Open DevTools (F12)
   - Look at Console tab for red errors
   - Check Network tab for failed requests

3. **Reinstall dependencies:**

   ```bash
   cd client
   rm -rf node_modules
   npm install
   npm run dev
   ```

4. **Check `vite.config.js`:**
   - Ensure backend URL is correct
   - Check port matches actual backend port

---

### Issue: "Module not found" / "Component not found"

**Cause:** Import path is incorrect

**Symptoms:**

- React component won't load
- Error mentions "Cannot find module"
- Page shows blank or error boundary

**Solution:**

1. **Check file exists:**
   - File path is case-sensitive on Linux/Mac
   - Verify file name and path match exactly

2. **Fix import statement:**

   ```javascript
   // Wrong
   import { Home } from "./components/home"; // file is Home.jsx

   // Correct
   import Home from "./components/Home";
   ```

3. **Check component exports:**

   ```javascript
   // Correct
   export default Home;

   // Or with named export
   export { Home };
   ```

---

## Debugging Techniques

### Enable Verbose Logging

**Backend:**

1. Check server console for request logs:

   ```javascript
   console.log("Creating journal for userID:", userID);
   ```

2. View logs in terminal where `npm start` runs

3. Add `NODE_ENV=development` in `.env` for detailed error messages

**Frontend:**

1. Open DevTools (F12) → Console tab
2. Check for JavaScript errors (red text)
3. Add console.log statements:
   ```javascript
   console.log("Response:", response);
   ```

---

### Network Tab Inspection

**See what data is actually being sent/received:**

1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action (login, create journal, etc.)
4. Click the request in the Network list
5. Inspect:
   - **Headers tab:** Request headers, authentication
   - **Payload tab:** Data sent to server
   - **Response tab:** Server response
   - **Preview tab:** Formatted response view

---

### Test API Directly with cURL

**Isolate frontend issues from backend:**

1. **Test login:**

   ```bash
   curl -X POST http://localhost:5050/api/user/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

2. **Test protected endpoint:**

   ```bash
   curl -X GET http://localhost:5050/api/user/me \
     -H "Authorization: Bearer eyJhbGc..."
   ```

3. **If cURL works but browser doesn't:**
   - Problem is in frontend code or CORS
   - Not a backend issue

---

### MongoDB Query Debugging

**Check if data exists in database:**

1. Connect to MongoDB:

   ```bash
   mongo
   # or
   mongosh
   ```

2. Select database:

   ```javascript
   use insight
   ```

3. Query data:

   ```javascript
   // Show all users
   db.users.find().pretty();

   // Show all journals
   db.journals.find().pretty();

   // Find specific user
   db.users.findOne({ email: "test@example.com" });
   ```

4. Check indexes:
   ```javascript
   db.users.getIndexes();
   ```

---

### Check Environment Variables

**Verify `.env` file is being read:**

1. In `server.js`, add debug log:

   ```javascript
   console.log("MongoDB URI:", process.env.MONGODB_URI);
   console.log("JWT Secret exists:", !!process.env.JWT_SECRET);
   console.log("Whitelisted domains:", process.env.WHITELISTED_DOMAINS);
   ```

2. Restart server and check output
3. Verify values are not undefined

---

## Getting Help

**If you can't find a solution:**

1. Check [API Reference](API.md) for endpoint specifications
2. Review [Setup Guide](SETUP.md) for configuration details
3. Look at server console logs for error messages
4. Use browser DevTools to inspect requests/responses
5. Test isolated parts (backend alone, frontend alone)
6. Review error response from API for details

**Provide this info when asking for help:**

- Exact error message
- Steps to reproduce
- Request being made (method, URL, headers)
- Response from server
- Relevant console logs
