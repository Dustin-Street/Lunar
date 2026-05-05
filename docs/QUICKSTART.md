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
