# Project Camp Backend

![projectcamp](https://github.com/user-attachments/assets/4e2fe8a1-eeb2-4d14-b5a4-1201770084d8)
Project Camp Backend is a comprehensive backend service that enables teams to organize projects, manage tasks with subtasks, maintain project notes, and handle user authentication with role-based access control. It provides a complete project management solution with team collaboration features.

## Features

### 🔐 Authentication & Authorization

- User registration with email verification
- Secure JWT-based authentication with refresh tokens
- Password management (change, forgot, reset)
- Role-based access control (Admin, Project Admin, Member)

### 📁 Project Management

- Create, read, update, and delete projects
- Team member management with role assignment
- Project-specific permissions and access control
- Member listing with roles

### ✅ Task Management

- Create and organize tasks within projects
- Three-state task status tracking (Todo, In Progress, Done)
- Task assignment to team members
- File attachments support for tasks
- Comprehensive task details and tracking

### 📝 Subtask Management

- Add subtasks to main tasks for better organization
- Update subtask details and completion status
- Role-based subtask management
- Progress tracking at subtask level

### 📌 Project Notes

- Create and manage project-level notes
- Organization and documentation within projects
- Role-based note access control

### 💚 System Health

- API health check endpoint for monitoring
- System status verification

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt
- **File Upload:** Multer
- **Cloud Storage:** Cloudinary
- **Email Service:** Nodemailer & Mailgen
- **Input Validation:** express-validator
- **Development:** Nodemon, Prettier

## Installation

### Prerequisites

- Node.js 14+
- MongoDB instance
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ProjectCamp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Server
   PORT=8000

   # Database
   MONGODB_URI=mongodb://localhost:27017/projectcamp

   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_EXPIRE=1h
   JWT_REFRESH_EXPIRE=7d

   # Email Service
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SENDER_EMAIL=noreply@projectcamp.com

   # Cloudinary (File Upload)
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Frontend URL (CORS)
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

   The server will be running at `http://localhost:8000`

## API Endpoints

### Authentication (`/api/v1/auth/`)

- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout (secured)
- `GET /current-user` - Get current user info (secured)
- `POST /change-password` - Change password (secured)
- `POST /refresh-token` - Refresh access token
- `GET /verify-email/:verificationToken` - Verify email
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:resetToken` - Reset password
- `POST /resend-email-verification` - Resend verification email (secured)

### Projects (`/api/v1/projects/`)

- `GET /` - List user projects (secured)
- `POST /` - Create project (secured)
- `GET /:projectId` - Get project details (secured)
- `PUT /:projectId` - Update project (Admin only)
- `DELETE /:projectId` - Delete project (Admin only)
- `GET /:projectId/members` - List project members (secured)
- `POST /:projectId/members` - Add member (Admin only)
- `PUT /:projectId/members/:userId` - Update member role (Admin only)
- `DELETE /:projectId/members/:userId` - Remove member (Admin only)

### Tasks (`/api/v1/tasks/`)

- `GET /:projectId` - List project tasks (secured)
- `POST /:projectId` - Create task (Admin/Project Admin only)
- `GET /:projectId/t/:taskId` - Get task details (secured)
- `PUT /:projectId/t/:taskId` - Update task (Admin/Project Admin only)
- `DELETE /:projectId/t/:taskId` - Delete task (Admin/Project Admin only)
- `POST /:projectId/t/:taskId/subtasks` - Create subtask (Admin/Project Admin only)
- `PUT /:projectId/st/:subTaskId` - Update subtask (secured)
- `DELETE /:projectId/st/:subTaskId` - Delete subtask (Admin/Project Admin only)

### Notes (`/api/v1/notes/`)

- `GET /:projectId` - List project notes (secured)
- `POST /:projectId` - Create note (Admin only)
- `GET /:projectId/n/:noteId` - Get note details (secured)
- `PUT /:projectId/n/:noteId` - Update note (Admin only)
- `DELETE /:projectId/n/:noteId` - Delete note (Admin only)

### Health Check (`/api/v1/healthcheck/`)

- `GET /` - System health status

## Project Structure

```
ProjectCamp/
├── public/
│   ├── images/          # Uploaded images
│   └── temp/            # Temporary files
├── src/
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.js
│   │   ├── note.controller.js
│   │   ├── project.controller.js
│   │   ├── task.controller.js
│   │   └── healthcheck.controller.js
│   ├── models/          # Database schemas
│   │   ├── user.model.js
│   │   ├── project.model.js
│   │   ├── task.model.js
│   │   └── note.model.js
│   ├── routes/          # API routes
│   │   ├── auth.route.js
│   │   ├── project.route.js
│   │   ├── task.route.js
│   │   ├── note.route.js
│   │   └── healthcheck.route.js
│   ├── middlewares/     # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   │   └── validator.middleware.js
│   ├── utils/           # Helper functions
│   │   ├── api-error.js
│   │   ├── api-response.js
│   │   ├── async-handler.js
│   │   ├── cloudinary.js
│   │   ├── constants.js
│   │   └── mail.js
│   ├── validators/      # Input validators
│   │   └── index.js
│   ├── db/              # Database connection
│   │   └── index.js
│   ├── app.js           # Express app setup
│   └── index.js         # Server entry point
├── package.json
├── README.md
└── PRD.md               # Product Requirements Document
```

## Permission Matrix

| Feature                    | Admin | Project Admin | Member |
| -------------------------- | :---: | :-----------: | :----: |
| Create Project             |   ✓   |       ✗       |   ✗    |
| Update/Delete Project      |   ✓   |       ✗       |   ✗    |
| Manage Project Members     |   ✓   |       ✗       |   ✗    |
| Create/Update/Delete Tasks |   ✓   |       ✓       |   ✗    |
| View Tasks                 |   ✓   |       ✓       |   ✓    |
| Update Subtask Status      |   ✓   |       ✓       |   ✓    |
| Create/Delete Subtasks     |   ✓   |       ✓       |   ✗    |
| Create/Update/Delete Notes |   ✓   |       ✗       |   ✗    |
| View Notes                 |   ✓   |       ✓       |   ✓    |

## User Roles

### Admin

- Full system access
- Project creation and management
- User and team management
- Content creation and deletion

### Project Admin

- Project-level administrative access
- Task and subtask management
- Team member oversight within projects

### Member

- View projects and assigned tasks
- Update task and subtask completion status
- Access project information and notes

## Security Features

- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based authorization middleware
- ✅ Input validation on all endpoints
- ✅ Email verification for account security
- ✅ Secure password reset functionality
- ✅ Password hashing with bcrypt
- ✅ File upload security with Multer
- ✅ CORS configuration for controlled cross-origin requests
- ✅ Environment variable-based configuration

## Development

### Running in Development Mode

```bash
npm run dev
```

Uses Nodemon for automatic server restart on file changes.

### Code Formatting

```bash
npx prettier --write src/
```

## Usage Example

### Register a User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Create a Project

```bash
curl -X POST http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

## Error Handling

The API uses consistent error responses in the following format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": []
}
```

---

**Last Updated:** January 2026
