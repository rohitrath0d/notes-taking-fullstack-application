# 📝 Notes Taking Full-Stack Application

A modern, feature-rich notes-taking web application built with React, TypeScript, Node.js, Express, and MongoDB. Features secure authentication with both email OTP and Google OAuth integration.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

## 🌟 Features

### Authentication
- **Email OTP Authentication** - Secure login/signup using one-time passwords sent via email
- **Google OAuth 2.0** - Seamless authentication with Google accounts
- **Unified Login/Signup Flow** - Single page for both login and registration
- **JWT Token-based Sessions** - Secure session management with JSON Web Tokens
- **Rate Limiting** - Protection against brute-force attacks

### Notes Management
- **Create Notes** - Add new notes with title and content
- **Read Notes** - View all your notes in a clean, organized layout
- **Update Notes** - Edit existing notes seamlessly
- **Delete Notes** - Remove notes you no longer need
- **Real-time Updates** - UI updates immediately after CRUD operations

### User Experience
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Collapsible Sidebar** - Clean navigation with toggle functionality
- **Lottie Animations** - Engaging animations on login and dashboard pages
- **Toast Notifications** - User-friendly feedback for all actions
- **Loading States** - Visual indicators during data fetching

## 🏗️ Tech Stack

### Frontend (Client)
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Library |
| **TypeScript** | Type Safety |
| **Vite 7** | Build Tool & Dev Server |
| **Tailwind CSS 4** | Styling |
| **React Router DOM 7** | Client-side Routing |
| **React Hook Form** | Form Management |
| **Zod** | Schema Validation |
| **Axios** | HTTP Client |
| **Sonner** | Toast Notifications |
| **Lucide React** | Icons |
| **Lottie React** | Animations |
| **Radix UI** | Accessible UI Primitives |

### Backend (Server)
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment |
| **Express 5** | Web Framework |
| **TypeScript** | Type Safety |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **Passport.js** | Authentication Middleware |
| **passport-google-oauth20** | Google OAuth Strategy |
| **JWT (jsonwebtoken)** | Token Generation & Verification |
| **bcryptjs** | Password Hashing |
| **Nodemailer** | Email Service (OTP) |
| **express-rate-limit** | Rate Limiting |
| **cookie-parser** | Cookie Handling |
| **CORS** | Cross-Origin Resource Sharing |

## 📁 Project Structure

```
notes-taking-fullstack-application/
├── client/                          # Frontend React Application
│   ├── src/
│   │   ├── assets/
│   │   │   └── animations/         # Lottie JSON animation files
│   │   ├── components/
│   │   │   ├── animations/         # Animation components
│   │   │   │   ├── LoginAnimation.tsx
│   │   │   │   └── NotesAnimation.tsx
│   │   │   ├── auth/
│   │   │   │   └── AuthCallBack.tsx  # OAuth callback handler
│   │   │   └── ui/                 # Reusable UI components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── form.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       └── sonner.tsx
│   │   ├── lib/
│   │   │   ├── api.ts              # Axios instance & API configuration
│   │   │   └── utils.ts            # Utility functions
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx   # Main dashboard with notes
│   │   │   ├── SignUpPage.tsx      # Signup page
│   │   │   └── UnifiedLoginAndSignInPage.tsx  # Combined auth page
│   │   ├── App.tsx                 # Root component with routing
│   │   ├── main.tsx                # Application entry point
│   │   └── index.css               # Global styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.js
│   └── package.json
│
├── server/                          # Backend Node.js Application
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts   # Authentication logic
│   │   │   └── notesController.ts  # Notes CRUD operations
│   │   ├── db/
│   │   │   └── dbConnection.ts     # MongoDB connection
│   │   ├── middlewares/
│   │   │   └── authMiddleware.ts   # JWT verification middleware
│   │   ├── models/
│   │   │   ├── notesModel.ts       # Note schema
│   │   │   ├── userModel.ts        # User schema
│   │   │   └── TemporaryCode.ts    # Temp code schema (OAuth)
│   │   ├── routes/
│   │   │   ├── authRoutes.ts       # Auth endpoints
│   │   │   ├── notesRoutes.ts      # Notes CRUD endpoints
│   │   │   └── googleoauthRoutes.ts # Google OAuth endpoints
│   │   ├── services/
│   │   │   ├── google-oauth.ts     # Passport Google strategy
│   │   │   └── rate-limiter.ts     # Rate limiting configuration
│   │   ├── types/
│   │   │   └── type.ts             # TypeScript type definitions
│   │   └── run.ts                  # Server entry point
│   ├── types/
│   │   └── express.d.ts            # Express type augmentation
│   ├── tsconfig.json
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Google Cloud Console Account** (for OAuth)
- **SendGrid Account** (for email OTP)

### Environment Variables

#### Server (`server/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/notes-app
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/notes-app

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/googleauth/google/callback

# Email Service (SendGrid)
SENDGRID_EMAIL_SERVICE_PASS=your-sendgrid-api-key

# Frontend URL (for CORS)
VITE_CLIENT_URL=http://localhost:5173
```

#### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohitrath0d/notes-taking-fullstack-application.git
   cd notes-taking-fullstack-application
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   - Create `.env` files in both `server/` and `client/` directories
   - Fill in the values as shown above

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Run the development servers**

   In the `server/` directory:
   ```bash
   npm run dev
   ```

   In a new terminal, in the `client/` directory:
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/request-otp` | Request OTP for email | No |
| POST | `/verify-otp` | Verify OTP | No |
| POST | `/unified-signup-or-login` | Complete signup or login | No |
| GET | `/me` | Get current user details | Yes |

### Google OAuth Routes (`/api/googleauth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/google` | Initiate Google OAuth | No |
| GET | `/google/callback` | OAuth callback handler | No |
| GET | `/check` | Check auth status & get token | No |
| POST | `/logout` | Logout and clear cookies | No |

### Notes Routes (`/api/notes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create` | Create a new note | Yes |
| GET | `/get` | Get all user's notes | Yes |
| PUT | `/update/:id` | Update a note | Yes |
| DELETE | `/delete/:id` | Delete a note | Yes |

## 🔐 Authentication Flow

### Email OTP Flow
1. User enters email on login/signup page
2. Server generates 6-digit OTP and sends via email
3. OTP stored in memory with 5-minute expiration
4. User enters OTP to verify email
5. New users set password; existing users proceed to login
6. JWT token generated and stored in localStorage

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. After consent, redirected to callback URL
4. Server creates/links user account
5. JWT stored in HTTP-only cookie
6. Frontend callback page retrieves token and stores in localStorage
7. User redirected to dashboard

## 🛡️ Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **JWT Authentication** - Tokens expire after 1-2 hours
- **HTTP-Only Cookies** - For Google OAuth tokens
- **Rate Limiting** - 5 OTP requests per 10 minutes, 10 login attempts per 15 minutes
- **CORS Configuration** - Restricted to frontend origin
- **Input Validation** - Zod schema validation on frontend

## 🎨 UI Components

The application uses a custom component library built on top of Radix UI primitives:

- **Button** - Variant-based button component
- **Card** - Content container with header, content, and footer
- **Form** - React Hook Form integrated form components
- **Input** - Styled input fields
- **Label** - Accessible form labels
- **Toaster** - Sonner toast notifications

## 📱 Screenshots

### Login/Signup Page
- Unified authentication page with email OTP and Google OAuth options
- Lottie animation on the left side
- Responsive design for mobile devices

### Dashboard
- Collapsible sidebar with user information
- Notes grid layout with create, edit, and delete actions
- Animated notes illustration when sidebar is collapsed

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Rohit Rathod**
- GitHub: [@rohitrath0d](https://github.com/rohitrath0d)

## 🙏 Acknowledgments

- [Lottie Files](https://lottiefiles.com/) for animations
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [shadcn/ui](https://ui.shadcn.com/) for component design inspiration
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---
