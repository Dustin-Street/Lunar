# Insight - Personal Journaling Application

A modern, secure full-stack web application for personal journaling and reflection. Built with React, Node.js, and MongoDB, Insight provides users with a beautiful interface to create, manage, and reflect on their personal journals while maintaining privacy and security.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based authentication with automatic token refresh and secure password hashing
- **📖 Journal Management**: Create, view, and delete personal journals with full CRUD operations
- **📝 Rich Journal Entries**: Write and manage journal entries
- **📊 User Statistics**: Track journaling activity and insights with computed statistics
- **🎨 Modern UI**: Responsive design built with Tailwind CSS and React

## 📸 Screenshots

### Login Interface

![Insight Login](docs/assets/images/LunarLoginFull.png)

### Mobile Login View

![Insight Mobile Login](docs/assets/images/LunarLoginSmall.png)

## 🔒 Security Features

### Frontend Security

- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **Form Validation**: Client-side validation with comprehensive error messages
- **Rate Limiting**: Login and signup attempts are rate-limited to prevent brute force
- **Secure Storage**: Sensitive data never stored in localStorage/sessionStorage
- **Clickjacking Protection**: Automatic detection and prevention of iframe-based attacks
- **CSP Headers**: Content Security Policy implementation (backend)
- **Request Interceptors**: Automatic request validation and sanitization
- **Error Sanitization**: Error messages sanitized to prevent information leakage
- **Secure Random Generation**: Cryptographically secure random values for nonces and IDs

### Authentication Security

- **JWT Tokens**: Short-lived access tokens (15 minutes) with automatic refresh
- **HTTP-Only Cookies**: Refresh tokens stored securely in HTTP-only cookies
- **Password Policies**: Strong password requirements with validation
- **Account Lockout**: Rate limiting prevents brute force attacks
- **Secure Logout**: Complete token cleanup on logout

### Data Protection

- **Input Validation**: Comprehensive validation for all user inputs
- **XSS Prevention**: HTML encoding and sanitization of all dynamic content
- **CSRF Protection**: Request headers and origin validation
- **Secure Headers**: Helmet.js provides comprehensive security headers
- **CORS Policy**: Strict cross-origin resource sharing controls

## 🔍 Security Monitoring & Auditing

### Automated Security Checks

- **Dependency Auditing**: Regular security audits of npm packages
- **Vulnerability Scanning**: Automated detection of known security issues
- **Sentry Integration**: Real-time error monitoring and alerting
- **Input Validation**: Comprehensive client and server-side validation

### Security Scripts

```bash
# Run security audit
npm run security-audit

# Check for vulnerabilities
audit-ci --config audit-ci.json
```

### Content Security Policy

CSP is implemented **exclusively server-side** via Helmet.js middleware in the backend, providing comprehensive protection against XSS and injection attacks. No client-side CSP plugins or functions are used to maintain simplicity and avoid dependency conflicts.

### Security Implementation Status

✅ **Active Security Features**: Input sanitization, form validation, rate limiting, secure HTTP interceptors, and dependency auditing are fully implemented and working.

⚠️ **Build Compatibility**: The SecurityInitializer component is temporarily disabled to ensure build compatibility. Security checks are still performed through other implemented measures.

- **📱 Mobile Friendly**: Responsive design that works on all devices
- **⚡ Fast Development**: Vite-powered frontend with hot module replacement
- **🛡️ Error Monitoring**: Sentry integration for production error tracking
- **📧 Account Recovery**: Email-based password reset functionality

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management for authentication and messaging

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for REST API
- **MongoDB** - NoSQL database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for secure authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

### DevOps & Monitoring

- **Sentry** - Error tracking and monitoring
- **Nodemailer** - Email service for account recovery
- **Multer** - File upload handling
- **Express Mongo Sanitize** - NoSQL injection protection

## 📋 Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud)
- **npm** (comes with Node.js)
- **Git** for cloning the repository

## 🚀 Quick Start

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

Edit `server/.env` with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/insight

# JWT Secrets (use strong random strings)
JWT_SECRET=your_jwt_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Server
PORT=5050
NODE_ENV=development

# CORS
WHITELISTED_DOMAINS=http://localhost:5173

# Email (for password recovery)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
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
cd server
npm start
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

## 📖 Usage

1. **Sign Up**: Create a new account with email and password
2. **Login**: Authenticate with your credentials
3. **Create Journal**: Start your first journal
4. **Write Entries**: Add reflections and thoughts
5. **View Statistics**: Track your journaling activity
6. **Manage Account**: Update profile and security settings

## 📚 Documentation

- **[Setup Guide](docs/SETUP.md)** - Detailed installation and configuration
- **[API Reference](docs/API.md)** - Complete REST API documentation
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Error Handling](docs/ERROR_HANDLING.md)** - Understanding error responses

## 🏗️ Project Structure

```
Insight/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── account/      # Authentication pages
│   │   │   ├── journal/      # Journal management
│   │   │   ├── layout/       # Navigation & UI components
│   │   │   └── context/      # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helper functions
│   │   └── assets/           # Static assets
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend
│   ├── routes/               # API route handlers
│   ├── schema/               # MongoDB schemas
│   ├── authentication/       # Passport strategies
│   ├── middleware/           # Express middleware
│   ├── database/            # Database connection
│   ├── utils/               # Server utilities
│   ├── package.json
│   └── server.js
├── docs/                     # Documentation
└── README.md
```

## 🔧 Development

### Available Scripts

#### Frontend

```bash
cd client
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend

```bash
cd server
npm start        # Start production server
```

### Code Quality

- **ESLint**: Configured for React and modern JavaScript
- **Prettier**: Code formatting (via ESLint)
- **Security**: Helmet, input sanitization, and validation

### Testing

Currently, the project focuses on development and learning. Testing frameworks can be added in future iterations.

## 🤝 Contributing

This project is currently in active development for learning purposes. Contributions are welcome for:

- Bug fixes and improvements
- Feature enhancements
- Documentation updates
- Security improvements

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## ⚠️ Disclaimer

This is a work-in-progress application developed for educational purposes. While it implements security best practices, it may contain bugs and is not recommended for production use without thorough testing and security audits.

## 📞 Support

For questions or issues:

1. Check the [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. Review server logs for error details
3. Check browser developer tools for client-side errors

---

_Built with for personal growth and reflection_
