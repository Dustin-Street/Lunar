# Insight - Personal Journal Application

A full-stack web application for secure, personal journaling with user authentication, real-time journal management, and creative interface. Some images are AI Generated as placeholder, I intend to refrence these later an create or commission these myself before any real Deployment. Very early development, still using this for learning and furthing my Web Development skills.

## Quick Links

- [Setup Instructions](docs/SETUP.md) - Get the app running locally (No Deployment yet...)
- [API Reference](docs/API.md) - Complete endpoint documentation
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Common issues & solutions
- [Error Handling](docs/ERROR_HANDLING.md) - Understanding error responses

---

## Features

✅ **User Authentication** - Secure signup/login with JWT tokens and refresh token rotation for security
✅ **Journal Management** - Create, read, update, and delete journals (CRUD)
✅ **Responsive UI** - Built with React + Tailwind CSS To later be mobile friendly with React Native
✅ **Token-Based Security** - JWT with automatic token refresh handling
✅ **API-Driven Architecture** - Clean separation of frontend and backend

---

## Tech Stack

**Frontend:**

- React with Vite (fast development environment)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Context API (state management)

**Backend:**

- Node.js + Express (REST API)
- MongoDB + Mongoose (database)
- Passport.js (authentication)
- JWT (JSON Web Tokens)

**Deployment Ready:**

- CORS configured for cross-origin requests
- Environment variable support
- Error handling & logging
- Graceful error responses

---

**Images**

![Login](docs/assets/images/LunarLoginFull.png)

![Login mobile](docs/assets/images/LunarLoginFull.png)

## Project Structure

```
client/                    # React frontend
├── src/
│   ├── components/       # Reusable React components
│   │   ├── account/      # Login & signup pages
│   │   ├── journal/      # Journal CRUD operations
│   │   ├── layout/       # Navigation & layout
│   │   └── context/      # Auth & messaging state
│   └── hooks/            # Custom React hooks
server/                    # Express backend
├── routes/               # API endpoint definitions
│   ├── user.js          # Auth endpoints
│   └── journals.js      # Journal management
├── schema/              # MongoDB schemas
├── authentication/      # JWT & local auth strategies
└── database/           # Database connection
LICENSE
README.md
```

---

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or Atlas connection string)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Insight
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   cp .env.example .env  # Configure environment variables
   npm start             # Starts on http://localhost:5050
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev           # Starts on http://localhost:5173
   ```

See [Setup Instructions](docs/SETUP.md) for detailed environment variable configuration.

---

## Architecture & Design

### Authentication Flow

The application implements a secure token-based authentication system:

1. User registers with email/password → password hashed with bcrypt
2. Login returns JWT token (15-minute expiry) + refresh token
3. Frontend stores JWT in memory (refresh token in secure cookie)
4. Expired JWT automatically refreshed via refresh token endpoint
5. Logout clears tokens on client side

**Key Security Features:**

- Passwords never transmitted or logged
- JWT tokens have short expiration times
- Refresh tokens rotated on use
- Limited refresh token storage (5 max per user)
- CORS restricted to whitelisted domains

### API Architecture

- RESTful endpoints following HTTP conventions
- Consistent error response format
- Pagination support for large datasets for Journals
- Request validation on all endpoints
- Comprehensive logging for debugging

this is a work in progress and is not intended to be bug-free, production ready or even good code just a learning element.
