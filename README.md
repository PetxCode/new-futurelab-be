# FutureLab Backend API

A comprehensive Express.js + MongoDB backend for the FutureLab educational platform featuring user authentication, profile management, points system, and assignment tracking.

## Features

- **User Authentication**: Sign up and sign in with JWT tokens
- **User Profile Management**: Update profile information and track progress
- **Points System**: Award points for completing assignments with level progression
- **Achievement System**: Track and award achievements based on user progress
- **Assignment Management**: Create, update, delete and track assignments
- **MongoDB Integration**: Persistent data storage with Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

## Installation

1. **Install dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Create a `.env` file** (based on `.env.example`):

   ```bash
   cp .env.example .env
   ```

3. **Configure your environment variables:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/themake
   JWT_SECRET=your_secure_secret_key_here
   NODE_ENV=development
   ```

## Running the Server

### Development Mode (with auto-reload):

```bash
npm run dev
```

### Production Mode:

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

#### Sign Up

- **POST** `/api/auth/signup`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "points": 0,
      "academicLevel": 1,
      "achievements": ["Beginner"]
    }
  }
  ```

#### Sign In

- **POST** `/api/auth/signin`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as Sign Up

#### Get Current User

- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "success": true,
    "user": { ... }
  }
  ```

### Users (`/api/users`)

#### Get User Profile

- **GET** `/api/users/:id`
- **Headers:** `Authorization: Bearer {token}`

#### Update User Profile

- **PUT** `/api/users/:id`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "grade": "Advanced",
    "avatar": "avatar_url"
  }
  ```

#### Get User Points

- **GET** `/api/users/:id/points`
- **Headers:** `Authorization: Bearer {token}`
- **Response:**
  ```json
  {
    "success": true,
    "points": 250,
    "academicLevel": 3,
    "levelProgress": 50,
    "grade": "Intermediate"
  }
  ```

#### Add Points

- **POST** `/api/users/:id/add-points`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "points": 50
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "points": 300,
    "academicLevel": 3,
    "levelProgress": 0,
    "message": "+50 points awarded!"
  }
  ```

#### Add Achievement

- **POST** `/api/users/:id/add-achievement`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "achievement": "First Assignment Complete"
  }
  ```

### Assignments (`/api/assignments`)

#### Create Assignment

- **POST** `/api/assignments`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "title": "Math Assignment 1",
    "subject": "Mathematics",
    "dueDate": "2024-02-01",
    "priority": "High",
    "points": 25,
    "description": "Complete exercises 1-10"
  }
  ```

#### Get All Assignments

- **GET** `/api/assignments`
- **Headers:** `Authorization: Bearer {token}`

#### Get Single Assignment

- **GET** `/api/assignments/:id`
- **Headers:** `Authorization: Bearer {token}`

#### Update Assignment

- **PUT** `/api/assignments/:id`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "status": "Completed",
    "priority": "Medium"
  }
  ```

#### Delete Assignment

- **DELETE** `/api/assignments/:id`
- **Headers:** `Authorization: Bearer {token}`

## Database Schema

### User Schema

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String,
  grade: String (enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  academicLevel: Number (1-100),
  levelProgress: Number (0-100),
  points: Number,
  achievements: [String],
  completedAssignments: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Assignment Schema

```javascript
{
  userId: ObjectId (ref: User),
  title: String (required),
  subject: String (required),
  dueDate: Date (required),
  priority: String (enum: ['High', 'Medium', 'Low']),
  status: String (enum: ['Not Started', 'In Progress', 'Review', 'Completed']),
  points: Number,
  description: String,
  createdAt: Date,
  completedAt: Date
}
```

## Points System

- Points are awarded when an assignment is marked as completed
- Every 100 points = 1 level up
- Level progress is calculated as: `points % 100`
- Academic levels range from 1 to 100+

## Middleware

### Authentication Middleware (`protect`)

- Verifies JWT token from Authorization header
- Attaches user data to request object
- Used on all protected routes

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:

- `200`: OK
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## MongoDB Setup

### Local MongoDB

```bash
# Start MongoDB service
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### MongoDB Atlas (Cloud)

1. Create a cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Add it to `.env` as `MONGODB_URI`

## Frontend Integration

The frontend API client is located at `src/services/api.ts` and includes:

- `authAPI.signup()`
- `authAPI.signin()`
- `authAPI.getCurrentUser()`
- `userAPI.getProfile()`
- `userAPI.updateProfile()`
- `userAPI.getPoints()`
- `userAPI.addPoints()`
- `userAPI.addAchievement()`
- `assignmentAPI.getAll()`
- `assignmentAPI.create()`
- `assignmentAPI.update()`
- `assignmentAPI.delete()`

## CORS Configuration

The backend accepts requests from:

- Development: `http://localhost:5173` (Vite dev server)
- Production: Configure in `src/index.js`

## Security Considerations

- Passwords are hashed using bcryptjs (10 salt rounds)
- JWT tokens expire after 30 days
- All sensitive data is excluded from responses
- Protected routes require valid JWT token
- User can only update their own profile

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Refresh token implementation
- [ ] Rate limiting
- [ ] Request logging and monitoring
- [ ] Notification system
- [ ] Social features (leaderboards, groups)
- [ ] Advanced analytics

## Contributing

When contributing to the backend:

1. Follow the existing code structure
2. Add error handling for all operations
3. Write meaningful commit messages
4. Test API endpoints before submitting

## License

MIT
