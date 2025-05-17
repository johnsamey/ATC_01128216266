# User API Documentation

This document provides detailed information about the User API endpoints, their request/response formats, and usage examples.

## Base URL

All endpoints are relative to: `/api/user`

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get Current User

Retrieves the currently authenticated user's information.

- **URL**: `/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Admin Required**: No

#### Response
```json
{
    "success": true,
    "message": "User retrieved successfully",
    "data": {
        "id": "user123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "userName": "john.doe@example.com"
    }
}
```



### 3. Update User

Updates the currently authenticated user's information.

- **URL**: `/me`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Admin Required**: No

#### Request Body
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
}
```

#### Response
```json
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "id": "user123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1234567890",
        "userName": "john.doe@example.com"
    }
}
```

### 4. Change Password

Changes the currently authenticated user's password.

- **URL**: `/me/password`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Admin Required**: No

#### Request Body
```json
{
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword123",
    "confirmPassword": "newPassword123"
}
```

#### Response
```json
{
    "success": true,
    "message": "Password changed successfully"
}
```

### 5. Delete Account

Deletes the currently authenticated user's account.

- **URL**: `/me`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Admin Required**: No

#### Response
```json
{
    "success": true,
    "message": "Account deleted successfully"
}
```



## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
    "success": false,
    "message": "Unauthorized",
    "errors": ["Invalid or missing authentication token"]
}
```

### 403 Forbidden
```json
{
    "success": false,
    "message": "Forbidden",
    "errors": ["Insufficient permissions to access this resource"]
}
```

### 400 Bad Request
```json
{
    "success": false,
    "message": "Invalid request",
    "errors": [
        "Email is already taken",
        "Password must be at least 6 characters",
        "Passwords do not match"
    ]
}
```

## Validation Rules

1. **Email**:
   - Must be a valid email format
   - Must be unique across all users
   - Used as username

2. **Password**:
   - Minimum length: 6 characters
   - Must contain at least one uppercase letter
   - Must contain at least one lowercase letter
   - Must contain at least one number
   - Must contain at least one special character

3. **Name**:
   - First name and last name are required
   - Maximum length: 50 characters each

## Notes

1. All endpoints require authentication
2. Email changes will also update the username
3. Password changes require the current password for verification
4. Account deletion is permanent and cannot be undone
7. Regular users can only modify their own information 



### 6. Get Total Users Count

Retrieves the total number of users in the system.

- **URL**: `/count`
- **Method**: `GET`
- **Auth Required**: Yes
- **Admin Required**: Yes

#### Response
```json
{
    "success": true,
    "message": "Total users count retrieved successfully",
    "data": 150
}
```


### 2. Get User by ID

Retrieves a specific user's information by their ID.

- **URL**: `/{id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **Admin Required**: Yes

#### Request Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | The ID of the user to retrieve |

#### Response
```json
{
    "success": true,
    "message": "User retrieved successfully",
    "data": {
        "id": "user123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "userName": "john.doe@example.com"
    }
}
```