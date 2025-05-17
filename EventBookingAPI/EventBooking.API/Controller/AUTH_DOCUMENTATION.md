# Authentication System Documentation

## 1. API Endpoints

### Login
- **URL**: `POST /api/auth/login`
- **Description**: Authenticates a user and returns a JWT token
- **Authentication**: Not required

### Registration
- **URL**: `POST /api/auth/register`
- **Description**: Registers a new user in the system
- **Authentication**: Not required

### Logout
- Currently implemented as client-side only (token removal from storage)

## 2. Request/Response Format

### Login Request (`LoginDto`)
```json
{
  "userName": "string",  // Required
  "password": "string"   // Required, min length 6
}
```

### Registration Request (`RegisterDto`)
```json
{
  "email": "string",     // Required, valid email format
  "userName": "string",  // Required
  "password": "string",  // Required, min length 6
  "firstName": "string", // Optional
  "lastName": "string"   // Optional
}
```

### Login Response (`Response<AuthResponseDto>`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "string",    // JWT token
    "user": {
      "id": "string",
      "userName": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "roles": ["string"]  // Array of role names
    },
    "expiresAt": "2024-03-21T10:00:00Z"  // Token expiration time
  }
}
```

## 3. Token Handling

### Token Type
- JWT (JSON Web Token)
- Bearer token format

### Storage
- Should be stored in `localStorage` on the client
- Format: `Bearer <token>`

### Token Lifetime
- 7 days from creation

### Token Claims
- `sub`: User ID
- `jti`: Unique token ID
- `name`: Username
- `role`: User roles

## 4. Error Handling

### Status Codes
- 200: Success
- 400: Bad Request (Invalid data, user exists)
- 401: Unauthorized (Invalid credentials)

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## 5. Role Management

### Available Roles
- "Admin": Full system access
- "User": Regular user access

### Role Implementation
- Included in JWT token claims
- Included in user response object
- Role-based authorization using policies:
  - "RequireAdminRole": For admin-only endpoints
  - "RequireUserRole": For user-only endpoints

## 6. Security Features

### Password Requirements
- Minimum length: 6 characters
- Stored with secure hashing (using ASP.NET Identity)

### JWT Configuration
- Uses secure signing key
- Includes expiration time
- Validates token signature
- No token refresh mechanism (tokens valid for 7 days)

## 7. Additional Features

### Admin Seeding
- Endpoint to create initial admin user
- Creates admin role if it doesn't exist
- Sets up default admin credentials

### User Registration
- Automatically assigns "User" role
- Case-insensitive username matching
- Email validation during registration
