# College Student Management Portal - Implementation Plan

## Project Overview

A full-stack College Student Management Portal with role-based access control for Academic Staff (Faculty/Administrative) and Students.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (access + refresh tokens)
- **Password Hashing**: bcrypt

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Jest (backend), Vitest (frontend)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (React SPA)                    │
│  - Login/Signup Pages                                    │
│  - Student Dashboard (Profile, Settings)                 │
│  - Academic Dashboard (Student Management)               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST API
                     │ (with JWT cookies)
┌────────────────────▼────────────────────────────────────┐
│              Server (Express API)                        │
│  - Authentication Routes                                 │
│  - Student Self-Service Routes                           │
│  - Academic Management Routes                            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              MongoDB Database                            │
│  - Users Collection                                      │
│  - StudentProfiles Collection                            │
└─────────────────────────────────────────────────────────┘
```

## User Roles & Permissions

### 1. Student Role
**Capabilities:**
- View own profile
- Update own profile (name, contact, department, year, avatar)
- Change password
- Upload profile photo

**Endpoints:**
- `GET /api/students/me` - Get own profile
- `PUT /api/students/me` - Update own profile
- `PUT /api/students/me/password` - Change password

### 2. Academic Role
**Sub-roles:**
- **Faculty**: Teaching staff
- **Administrative**: Administrative staff

**Capabilities:**
- View all students
- Create new students
- Update student profiles
- Activate/deactivate students
- Search and filter students

**Endpoints:**
- `GET /api/students` - List all students (with filters)
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `PATCH /api/students/:id/status` - Toggle student status
- `DELETE /api/students/:id` - Soft delete student

## Data Models

### User Model
```typescript
{
  email: string (unique, required)
  passwordHash: string (required)
  role: 'academic' | 'student' (required)
  subRole: 'faculty' | 'administrative' (optional, for academic)
  status: 'active' | 'inactive' (default: 'active')
  createdAt: Date
  updatedAt: Date
}
```

### StudentProfile Model
```typescript
{
  user: ObjectId (ref: User, required, unique)
  firstName: string (required)
  lastName: string (required)
  dob: Date (optional)
  contact: {
    phone: string (optional)
    address: string (optional)
    city: string (optional)
    state: string (optional)
    zip: string (optional)
  }
  department: string (optional)
  year: number (1-5, optional)
  avatarUrl: string (optional)
  createdAt: Date
  updatedAt: Date
}
```

## Authentication Flow

1. **Registration**
   - User selects role (Student/Academic)
   - If Academic: selects sub-role (Faculty/Administrative)
   - If Student: provides profile details
   - Password hashed with bcrypt
   - User created with status 'active'
   - Auto-login after registration

2. **Login**
   - User provides email, password, and role
   - Server validates credentials and role match
   - JWT access token (15min) + refresh token (7days) issued
   - Tokens stored in HttpOnly cookies
   - Redirect based on role:
     - Student → `/dashboard/student`
     - Academic → `/dashboard/academic`

3. **Session Management**
   - Access token in cookie for API requests
   - Refresh token rotates on `/api/auth/refresh`
   - Logout clears both cookies

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (requires role)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Student Self-Service
- `GET /api/students/me` - Get own profile (student only)
- `PUT /api/students/me` - Update own profile (student only)
- `PUT /api/students/me/password` - Change password (student only)

### Academic Management
- `GET /api/students` - List students (academic only)
  - Query params: `department`, `year`, `q` (search)
- `GET /api/students/:id` - Get student details (academic only)
- `POST /api/students` - Create student (academic only)
- `PUT /api/students/:id` - Update student (academic only)
- `PATCH /api/students/:id/status` - Toggle status (academic only)
- `DELETE /api/students/:id` - Soft delete (academic only)

## Frontend Pages & Routes

### Public Routes
- `/login` - Login page (role dropdown)
- `/signup` - Registration page

### Student Routes (Protected)
- `/dashboard/student` - Student dashboard
- `/student/profile` - View/edit profile
- `/student/settings` - Change password

### Academic Routes (Protected)
- `/dashboard/academic` - Academic dashboard
- `/academic/students` - Students list
- `/academic/students/new` - Create student
- `/academic/students/:id` - Student details
- `/academic/students/:id/edit` - Edit student

## Security Features

- ✅ JWT-based authentication
- ✅ HttpOnly cookies (XSS protection)
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ Role-based access control (RBAC)
- ✅ Request body size limits (10MB for images)
- ✅ CORS configuration
- ✅ Input validation (express-validator)
- ✅ Error handling middleware
- ✅ Security headers (Helmet)
- ✅ Rate limiting (express-rate-limit)
- ✅ Input sanitization
- ✅ Request size validation

## Features Implemented

### ✅ Core Features
- [x] User registration (Student & Academic with sub-roles)
- [x] User login with role selection
- [x] JWT authentication with refresh tokens
- [x] Student profile management
- [x] Academic student management (CRUD)
- [x] Profile photo upload (base64 or URL)
- [x] Password change functionality
- [x] Role-based navigation
- [x] Protected routes with guards

### ✅ Additional Features
- [x] MongoDB MCP Server for AI integration
- [x] Docker Compose setup
- [x] GitHub Actions CI/CD
- [x] Integration tests
- [x] Frontend smoke tests
- [x] Auto-reload development setup

## File Structure

```
gnit/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client & helpers
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── router.tsx     # Route configuration
│   │   ├── routesGuards.tsx # Route protection
│   │   └── store/         # Zustand stores
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # Environment & DB config
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth & RBAC middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Route definitions
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities (tokens, errors)
│   └── tests/             # Integration tests
│
├── mcp-mongodb/           # MongoDB MCP Server
│   ├── src/
│   │   ├── tools/         # MCP tools
│   │   └── database/      # MongoDB connection
│   └── README.md
│
├── docker-compose.yml     # Docker services
├── package.json           # Root scripts
└── README.md              # Project documentation
```

## Development Workflow

1. **Start MongoDB**: `./start-mongo.sh`
2. **Start Development**: `npm run dev` (runs both server & client)
3. **Run Tests**: 
   - Backend: `cd server && npm test`
   - Frontend: `cd client && npm test`

## Deployment

### Docker Compose
```bash
docker compose up -d
```

### Environment Variables
- Server: `PORT`, `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_ORIGIN`
- Client: `VITE_API_BASE_URL`

## Future Enhancements (Optional)

- [ ] Email verification
- [ ] Password reset functionality
- [ ] File upload service (S3/Cloudinary) for avatars
- [ ] Course management
- [ ] Attendance tracking
- [ ] Grade management
- [ ] Notifications system
- [ ] Admin dashboard analytics
- [ ] Export student data (CSV/PDF)
- [ ] Bulk student import

## Testing Strategy

- **Backend**: Integration tests for auth flows and CRUD operations
- **Frontend**: Component tests and route guard tests
- **E2E**: (Future) Playwright/Cypress tests

## Security Considerations

- ✅ Passwords never stored in plain text
- ✅ JWT tokens in HttpOnly cookies
- ✅ CORS configured for specific origin
- ✅ Input validation on all endpoints
- ✅ Role-based route protection
- ⚠️ MongoDB authentication (optional, currently disabled for dev)
- ⚠️ Rate limiting (to be added)
- ⚠️ HTTPS in production (required)

## Status

**Current Status**: ✅ Core features implemented and functional

All major features from the original plan have been implemented:
- Authentication system with role-based access
- Student self-service portal
- Academic management portal
- Profile photo upload
- Sub-roles for academic users
- MongoDB MCP server for AI integration

