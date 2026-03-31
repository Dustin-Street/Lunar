# Error Handling Guide - Insight Application

Understanding how errors work and how to debug them effectively.

---

## Error Response Structure

All errors follow a consistent format, making it easier to diagnose issues.

### Standard Error Response

**Most endpoints return errors like:**

```json
{
  "message": "User not found are you sure you have an account?"
}
```

Or:

```json
{
  "success": false,
  "message": "Error description"
}
```

Some errors include additional context:

```json
{
  "message": "Email and password are required",
  "error": "ValidationError: email is required"
}
```

---

## HTTP Status Codes

Understand what each status code means:

| Code | Name | Meaning | What to Do |
|------|------|---------|-----------|
| 200 | OK | Request succeeded | Success, use response data |
| 201 | Created | Resource created | Success, new record saved |
| 400 | Bad Request | Invalid request format | Check request headers, body, parameters |
| 401 | Unauthorized | Authentication required or failed | Add token to Authorization header or refresh token |
| 404 | Not Found | Resource doesn't exist | Verify ID is correct, resource wasn't deleted |
| 409 | Conflict | Resource already exists | Email taken, duplicate record |
| 500 | Server Error | Backend error | Server crashed or database error, try again |

---

## Common Error Scenarios

### 400 Bad Request

**What it means:** Your request is malformed or missing required data.

**Example response:**
```json
{
  "message": "Email and password are required"
}
```

**How to fix:**
1. Check request body has all required fields
2. Verify JSON syntax is correct
3. Check data types match expectations (strings, numbers, objects)
4. See [API Reference](API.md) for required fields per endpoint

**Example request:**
```bash
# Bad: Missing password field
curl -X POST http://localhost:5050/api/user/createUser \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Good: All required fields
curl -X POST http://localhost:5050/api/user/createUser \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "MyPassword123",
    "username": "testuser"
  }'
```

---

### 401 Unauthorized

**What it means:** You need to authenticate or your authentication is invalid.

**Example response:**
```json
{
  "message": "Unauthorized"
}
```

**Common causes:**

1. **Missing Authorization header**
   ```
   ❌ Wrong: No Authorization header
   GET /api/user/me
   
   ✅ Correct: Include Authorization header
   GET /api/user/me
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

2. **Token expired (15-minute lifetime)**
   - Solution: Call `/user/refreshToken` endpoint
   - Then retry with new token

3. **Invalid token format**
   ```
   ❌ Wrong: Authorization: <token>
   ✅ Correct: Authorization: Bearer <token>
   ```

4. **Wrong token**
   - Solution: Login again to get new token
   - Store and use that token

**How to fix:**
1. Ensure `Authorization: Bearer <token>` header exists
2. Verify token value (should be long JWT string starting with `eyJ`)
3. If expired, refresh token via `POST /user/refreshToken`
4. If still fails, login again to get new token

---

### 404 Not Found

**What it means:** The resource you're asking for doesn't exist.

**Example response:**
```json
{
  "message": "User not found are you sure you have an account?"
}
```

**Common causes:**

1. **Wrong ID format**
   ```
   ❌ Wrong: /journals/123 (too short)
   ✅ Correct: /journals/507f1f77bcf86cd799439011 (24 hex chars)
   ```

2. **Resource was deleted**
   - The journal or user no longer exists in database

3. **Wrong endpoint path**
   ```
   ❌ Wrong: /journal/journals/id (typo)
   ✅ Correct: /journals/journals/id
   ```

**How to fix:**
1. Verify MongoDB ID format (24 hexadecimal characters)
2. Ensure resource still exists (check in database or list endpoints)
3. Check endpoint URL exactly matches [API Reference](API.md)

---

### 409 Conflict

**What it means:** You're trying to create a resource that already exists.

**Example response:**
```json
{
  "message": "A user with the given email is already registered"
}
```

**Common causes:**

1. **Email already registered**
   - Solution: Use different email or login with existing account

2. **Duplicate data**
   - Try-catch in route prevents duplicate entries

**How to fix:**
1. For email conflict: Use a different email address
2. For other conflicts: Check [Troubleshooting Guide](TROUBLESHOOTING.md)

---

### 500 Server Error

**What it means:** Something went wrong on the backend.

**Example response:**
```json
{
  "message": "Failed to fetch user"
}
```

**Common causes:**

1. **Database connection failed**
   - MongoDB isn't running
   - Connection string is wrong

2. **Code error**
   - Bug in route handler
   - Unexpected data format

3. **Missing environment variable**
   - `.env` file missing or incomplete

**How to fix:**
1. Check server console logs for error details
2. Verify MongoDB is running: `mongo` or `mongosh`
3. Check `.env` file has all required variables
4. Try the request again (might be temporary)

**Debug example:**

Server console shows:
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

→ MongoDB isn't running, start it: `mongod`

---

## Error Handling in Frontend Code

### Best Practice: Handle all error responses

```javascript
// React component example
const [error, setError] = useState(null);
const [isLoading, setIsLoading] = useState(false);

const handleLogin = async (email, password) => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await axios.post('/api/user/login', {
      email,
      password
    });

    // Success
    const { token } = response.data;
    // In this app tokens are handled in-memory through AuthContext
    // and refresh tokens are stored as HttpOnly cookies.
    // Do not persist access tokens in localStorage/sessionStorage.
    window.location.href = '/dashboard';

  } catch (err) {
    // Handle error response
    const message = err.response?.data?.message || 'An error occurred';
    setError(message);
    console.error('Login error:', err);

  } finally {
    setIsLoading(false);
  }
};
```

### Specific Error Handling

```javascript
// Handle different error types
if (err.response?.status === 401) {
  // Token expired, try to refresh
  await refreshToken();
  // Retry request
} else if (err.response?.status === 409) {
  // Conflict - resource exists
  setError('This email is already registered');
} else if (err.response?.status === 500) {
  // Server error
  setError('Server error, try again later');
} else if (!err.response) {
  // Network error
  setError('Network error, check server is running');
}
```

---

## Debugging Strategy

### Step 1: Identify the error

**Check HTTP status code:**
- 4xx = Client error (your request is wrong)
- 5xx = Server error (backend issue)

### Step 2: Read the error message

**Error message tells you what's wrong:**
- "Email and password are required" → Add missing fields
- "A user with the given email is already registered" → Use different email
- "User not found" → Check user ID is correct

### Step 3: Inspect the request

**In browser DevTools:**
1. Network tab → Find the failing request
2. Check Request Headers (Authorization, Content-Type)
3. Check Payload (request body, match required format)

**Example inspection:**
```
REQUEST HEADERS:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  Content-Type: application/json

REQUEST BODY:
  {
    "email": "test@example.com",
    "password": "test123"
  }

RESPONSE STATUS: 401 Unauthorized
```

→ Problem: Token is invalid/expired, need to refresh

### Step 4: Fix and retry

**Based on error type:**
- 400 → Fix request format
- 401 → Add/refresh token
- 404 → Verify ID exists
- 409 → Use different data
- 500 → Check server logs

---

## Server-Side Error Logs

### Accessing Server Logs

**All API requests are logged on server:**

```javascript
// Example server console output
Creating journal for userID: 507f1f77bcf86cd799439011 with title: My Journal
Fetching journals for userID: 507f1f77bcf86cd799439011
```

**Check for error logs:**

```
Error: Cast to ObjectId failed for value "invalid_id" at path "_id" for model "User"
```

This tells you the ID format is wrong.

### Enable Debug Mode

**In `server/.env`:**
```env
NODE_ENV=development
DEBUG=*
```

Then restart server for more detailed logs.

---

## Common Error Messages Explained

| Error Message | Cause | Fix |
|---------------|-------|-----|
| "Email and password are required" | Missing field in signup | Add all required fields |
| "A user with the given email is already registered" | Email exists | Use different email |
| "Invalid credentials" | Wrong email/password on login | Check spelling, try signup |
| "User not found are you sure you have an account?" | User ID doesn't exist | Verify user ID format |
| "No journals found" | Journal ID doesn't exist | Check journal ID is correct |
| "Journal deleted successfully" | This is success, not error | Your deletion worked! |
| "Token expired" | JWT token time limit exceeded | Call refresh endpoint |
| "Unauthorized" | No/invalid authentication | Add Authorization header |
| "Cannot POST /api/..." | Route not found or backend down | Check URL, restart server |
| "MongooseServerSelectionError" | MongoDB not running | Start MongoDB |

---

## Testing Error Scenarios

### Test 401 Unauthorized
```bash
# Call protected endpoint without token
curl -X GET http://localhost:5050/api/user/me
# Response: Unauthorized
```

### Test 404 Not Found
```bash
# Use invalid journal ID
curl -X GET http://localhost:5050/api/journals/journals/invalid_id \
  -H "Authorization: Bearer <token>"
# Response: No journals found
```

### Test 400 Bad Request
```bash
# Missing required password field
curl -X POST http://localhost:5050/api/user/createUser \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
# Response: Email and password are required
```

### Test 409 Conflict
```bash
# Try to register with existing email
curl -X POST http://localhost:5050/api/user/createUser \
  -H "Content-Type: application/json" \
  -d '{
    "email":"existing@example.com",
    "password":"test123",
    "username":"test"
  }'
# Response: A user with the given email is already registered
```

---

## Error Prevention Best Practices

### On Frontend

1. **Always include Authorization header for protected routes**
   ```javascript
   headers: { Authorization: `Bearer ${token}` }
   ```

2. **Handle token expiration gracefully**
   ```javascript
   if (err.response?.status === 401) {
     refreshToken(); // Get new token
   }
   ```

3. **Validate input before sending**
   ```javascript
   if (!email || !password) {
     setError('Email and password required');
     return;
   }
   ```

4. **Show user-friendly error messages**
   ```javascript
   // Don't show raw error: "Cast to ObjectId failed..."
   // Instead show: "Invalid ID format"
   ```

### On Backend

1. **Validate all input**
   ```javascript
   if (!email || !password) {
     return res.status(400).json({ message: "..." });
   }
   ```

2. **Check authentication on protected routes**
   ```javascript
   router.get('/me', authenticateToken, async (req, res) => { ... })
   ```

3. **Use try-catch for all database operations**
   ```javascript
   try {
     // database query
   } catch (error) {
     next(error); // Pass to error handler
   }
   ```

4. **Return consistent error format**
   ```javascript
   res.status(404).json({ message: "User not found" });
   ```

---

## Support

**Still having issues?**
1. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review [API Reference](API.md) for correct format
3. Inspect server logs and browser DevTools
4. Test with cURL to isolate the problem
