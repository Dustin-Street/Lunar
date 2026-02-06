# API Reference - Insight Application

Complete documentation of all REST API endpoints with examples and error codes.

## Base URL

```
http://localhost:5050/api
```

All requests should use this base URL. Examples below show relative paths.

---

## Authentication Endpoints

### Register New User

Create a new user account.

**Endpoint:** `POST /user/createUser`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Successfully created account. Welcome john_doe!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|---------------|-------|
| 400 | "Email and password are required" | Missing email or password field |
| 409 | "A user with the given email is already registered" | Email already exists in database |
| 400 | Error message from validation | Invalid input format |

**cURL Example:**
```bash
curl -X POST http://localhost:5050/api/user/createUser \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "jane_doe",
    "password": "MyPassword123"
  }'
```

---

### User Login

Authenticate with email and password.

**Endpoint:** `POST /user/login`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe",
    "dateCreated": "2025-02-01T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|---------------|-------|
| 401 | "Invalid credentials" | Email or password incorrect |
| 500 | "Server error try again later" | Database or internal error |

**cURL Example:**
```bash
curl -X POST http://localhost:5050/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

---

### Refresh Token

Get a new access token using the refresh token from login.

**Endpoint:** `POST /user/refreshToken`

**Request Headers:**
```
Cookie: refreshToken=<refresh_token_from_login>
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|---------------|-------|
| 401 | "Unauthorized" | Refresh token missing, invalid, or expired |

**How It Works:**
1. User logs in → receives `token` (valid for 15 minutes)
2. Token expires → client calls `/refreshToken`
3. Server validates refresh token → returns new access token
4. Client stores new token and continues

---

### Get Current User

Fetch the authenticated user's profile information.

**Endpoint:** `GET /user/me`

**Request Headers:**
```
Authorization: Bearer <access_token_from_login>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe",
    "journals": [
      "607f1f77bcf86cd799439012",
      "607f1f77bcf86cd799439013"
    ],
    "dateCreated": "2025-02-01T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|---------------|-------|
| 401 | "Unauthorized" | Token missing or invalid |
| 404 | "User not found are you sure you have an account?" | User deleted from database |
| 500 | "Failed to fetch user" | Database error |

**cURL Example:**
```bash
curl -X GET http://localhost:5050/api/user/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Journal Endpoints

All journal endpoints require authentication. Include `Authorization: Bearer <token>` header.

### Create Journal

Create a new journal for the authenticated user.

**Endpoint:** `POST /journals/createJournal`

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My First Journal",
  "userID": "507f1f77bcf86cd799439011"
}
```

**Response (201 Created):**
```json
{
  "_id": "607f1f77bcf86cd799439020",
  "title": "My First Journal",
  "userID": "507f1f77bcf86cd799439011",
  "entries": [],
  "createdAt": "2025-02-05T14:20:00.000Z",
  "updatedAt": "2025-02-05T14:20:00.000Z"
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|---------------|-------|
| 401 | "Unauthorized" | Missing or invalid token |
| 400 | Various | Validation error (missing title or userID) |
| 500 | Internal server error | Database error |

**cURL Example:**
```bash
curl -X POST http://localhost:5050/api/journals/createJournal \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Journal",
    "userID": "507f1f77bcf86cd799439011"
  }'
```

---

### Get User's Journals

Retrieve all journals for a specific user.

**Endpoint:** `GET /journals/:userId`

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `userId` (string): MongoDB user ID

**Response (200 OK):**
```json
{
  "docs": [
    {
      "_id": "607f1f77bcf86cd799439020",
      "title": "My First Journal",
      "userID": "507f1f77bcf86cd799439011",
      "entries": [],
      "createdAt": "2025-02-05T14:20:00.000Z"
    },
    {
      "_id": "607f1f77bcf86cd799439021",
      "title": "Work Journal",
      "userID": "507f1f77bcf86cd799439011",
      "entries": ["607f1f77bcf86cd799439022"],
      "createdAt": "2025-02-04T09:15:00.000Z"
    }
  ],
  "journalTitle": "My First Journal"
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|---------------|-------|
| 404 | "User not found" | User ID doesn't exist |
| 401 | "Unauthorized" | Missing or invalid token |

**cURL Example:**
```bash
curl -X GET http://localhost:5050/api/journals/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

---

### Get Journal Details

Retrieve a specific journal by ID.

**Endpoint:** `GET /journals/journals/:id`

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id` (string): MongoDB journal ID

**Response (200 OK):**
```json
{
  "_id": "607f1f77bcf86cd799439020",
  "title": "My First Journal",
  "userID": "507f1f77bcf86cd799439011",
  "entries": [
    "607f1f77bcf86cd799439022",
    "607f1f77bcf86cd799439023"
  ],
  "createdAt": "2025-02-05T14:20:00.000Z",
  "updatedAt": "2025-02-05T15:30:00.000Z"
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|---------------|-------|
| 404 | "No journals found" | Journal ID doesn't exist |
| 401 | "Unauthorized" | Missing or invalid token |

**cURL Example:**
```bash
curl -X GET http://localhost:5050/api/journals/journals/607f1f77bcf86cd799439020 \
  -H "Authorization: Bearer <token>"
```

---

### Delete Journal

Delete a journal and remove it from the user's journal list.

**Endpoint:** `DELETE /journals/journals/:id`

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id` (string): MongoDB journal ID to delete

**Response (200 OK):**
```json
{
  "message": "Journal deleted successfully",
  "success": true
}
```

**Error Responses:**

| Status | Error Message | Cause |
|--------|---------------|-------|
| 404 | "Journal not found" | Journal ID doesn't exist |
| 401 | "Unauthorized" | Missing or invalid token |
| 500 | Internal error | Database error |

**cURL Example:**
```bash
curl -X DELETE http://localhost:5050/api/journals/journals/607f1f77bcf86cd799439020 \
  -H "Authorization: Bearer <token>"
```

---

### Get Paginated Journal Entries

Retrieve journal entries with pagination support.

**Endpoint:** `GET /journals/journalEntry`

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Entries per page (default: 100)

**Response (200 OK):**
```json
{
  "docs": [
    {
      "_id": "607f1f77bcf86cd799439022",
      "content": "Today was a great day!",
      "journalId": "607f1f77bcf86cd799439020",
      "createdAt": "2025-02-05T15:30:00.000Z"
    }
  ],
  "totalDocs": 50,
  "limit": 100,
  "page": 1,
  "pages": 1
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5050/api/journals/journalEntry?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

## Common Patterns

### Authentication Header Format

For any protected endpoint, always include:
```
Authorization: Bearer <your_access_token>
```

Replace `<your_access_token>` with the token received from login or refresh token endpoint.

### Handling Token Expiration

1. **Receive error:** `{ "message": "Token expired" }` (401)
2. **Call refresh endpoint:** `POST /user/refreshToken`
3. **Get new token** from response
4. **Retry original request** with new token

### Handling Validation Errors

When you get a `400` error, check:
- All required fields are present in request body
- Data types match (strings, numbers, etc.)
- IDs are valid MongoDB ObjectIDs (24 hex characters)

---

## Testing with Postman

1. **Create a new request** with method and URL
2. **Set headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer <token>` (for protected endpoints)
3. **Set body** as JSON (for POST/PUT requests)
4. **Click Send** and view the response

### Example Postman Flow:
1. `POST /user/createUser` → Save the `token` from response
2. `GET /user/me` → Use token in header
3. `POST /journals/createJournal` → Use token in header
4. `GET /journals/:userId` → Use token in header

---

## Error Codes Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request body and parameters |
| 401 | Unauthorized | Add/refresh your authentication token |
| 404 | Not Found | Verify the resource ID is correct |
| 409 | Conflict | Resource already exists (e.g., email taken) |
| 500 | Server Error | Server issue, try again or contact support |

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, consider implementing rate limiting on auth endpoints to prevent brute-force attacks.

---

## Response Format

All responses follow this structure:

**Success (2xx):**
```json
{
  "success": true,
  "message": "Optional success message",
  "data": { "...": "..." }
}
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "message": "Error description"
}
```

Or error object directly:
```json
{
  "message": "Error description",
  "error": "Error details"
}
```

---

## Support

For issues calling these endpoints:
1. Check [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Verify request format matches examples above
3. Check browser console (F12) for error details
4. Review server logs for database errors
