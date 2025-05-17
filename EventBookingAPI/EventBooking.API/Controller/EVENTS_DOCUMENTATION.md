# Events System Documentation

## 1. API Endpoints

### Get All Events
- **URL**: `GET /api/events`
- **Description**: Retrieves a paginated list of events with optional filtering
- **Authentication**: Not required
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `pageSize`: Items per page (default: 10)
  - `searchTerm`: Search term for filtering events
  - `categoryId`: Filter events by category ID

### Get Event by ID
- **URL**: `GET /api/events/{id}`
- **Description**: Retrieves a specific event by its ID
- **Authentication**: Not required

### Create Event
- **URL**: `POST /api/events`
- **Description**: Creates a new event
- **Authentication**: Required (Admin role)
- **Content-Type**: `multipart/form-data`

### Delete Event
- **URL**: `DELETE /api/events/{id}`
- **Description**: Deletes an event by its ID
- **Authentication**: Required (Admin role)

## 2. Request/Response Format

### Create Event Request (`EventCreateDto`)
```json
{
  "title": "string",           // Required
  "description": "string",     // Required
  "categoryId": "integer",     // Required
  "startDate": "datetime",     // Required
  "endDate": "datetime",       // Required
  "venue": "string",          // Required
  "price": "decimal",         // Required, range: 0-10000
  "img": "file"              // Optional, image file
}
```

### Event Response (`EventDto`)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "integer",
    "title": "string",
    "description": "string",
    "categoryId": "integer",
    "categoryName": "string",
    "startDate": "datetime",
    "endDate": "datetime",
    "venue": "string",
    "price": "decimal",
    "imageUrl": "string",
    "tags": [
      {
        // TagDto properties
      }
    ],
    "isBooked": "boolean"
  }
}
```

### Paginated Events Response (`PagedResult<EventDto>`)
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": {
    "items": [
      // Array of EventDto objects
    ],
    "totalCount": "integer",
    "pageNumber": "integer",
    "pageSize": "integer",
    "totalPages": "integer"
  }
}
```

## 3. Image Handling

### Image Upload
- Supports image upload during event creation
- Images are stored in the server's file system
- Returns a URL for the uploaded image

### Image Requirements
- File type: Common image formats (jpg, png, etc.)
- Size: Server-configured maximum size limit

## 4. Error Handling

### Status Codes
- 200: Success
- 201: Created (Event creation)
- 400: Bad Request (Invalid data)
- 401: Unauthorized (Missing authentication)
- 403: Forbidden (Insufficient permissions)
- 404: Not Found (Event not found)

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## 5. Authorization

### Role Requirements
- Create Event: Admin role required
- Delete Event: Admin role required
- Get Events: No authentication required
- Get Event by ID: No authentication required

### Policy Implementation
- Uses "RequireAdminRole" policy for admin-only endpoints
- Role-based authorization using ASP.NET Core policies

## 6. Additional Features

### Pagination
- Supports server-side pagination
- Configurable page size
- Returns total count and page information

### Search and Filtering
- Text-based search across event fields
- Category-based filtering
- Combined search and filter capabilities

### User Context
- Includes user-specific information in responses
- Tracks user registration status for events
- Provides attendee count information 
