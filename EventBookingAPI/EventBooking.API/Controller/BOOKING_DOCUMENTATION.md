# Booking API Documentation

This document provides detailed information about the Booking API endpoints, their request/response formats, and usage examples.

## Base URL

All endpoints are relative to: `/api/booking`

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get Booking by ID

Retrieves a specific booking by its ID.

- **URL**: `/{id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **Admin Required**: No

#### Request Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | int | The ID of the booking to retrieve |

#### Response
```json
{
    "success": true,
    "message": "Booking retrieved successfully",
    "data": {
        "id": 1,
        "userId": "user123",
        "eventId": 1,
        "bookingDate": "2024-03-20T10:00:00Z",
        "numberOfTickets": 2,
        "totalPrice": 100.00,
        "status": "Confirmed"
    }
}
```

### 2. Get All Bookings

Retrieves a paginated list of all bookings.

- **URL**: `/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Admin Required**: Yes

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 1 | Page number |
| pageSize | int | 10 | Number of items per page |

#### Response
```json
{
    "success": true,
    "message": "Bookings retrieved successfully",
    "data": {
        "items": [
            {
                "id": 1,
                "userId": "user123",
                "eventId": 1,
                "bookingDate": "2024-03-20T10:00:00Z",
                "numberOfTickets": 2,
                "totalPrice": 100.00,
                "status": "Confirmed"
            }
        ],
        "totalCount": 50,
        "page": 1,
        "pageSize": 10
    }
}
```

### 3. Get User Bookings

Retrieves a paginated list of bookings for the authenticated user.

- **URL**: `/user`
- **Method**: `GET`
- **Auth Required**: Yes
- **Admin Required**: No

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 1 | Page number |
| pageSize | int | 10 | Number of items per page |

#### Response
```json
{
    "success": true,
    "message": "User bookings retrieved successfully",
    "data": {
        "items": [
            {
                "id": 1,
                "userId": "user123",
                "eventId": 1,
                "bookingDate": "2024-03-20T10:00:00Z",
                "numberOfTickets": 2,
                "totalPrice": 100.00,
                "status": "Confirmed"
            }
        ],
        "totalCount": 5,
        "page": 1,
        "pageSize": 10
    }
}
```

### 4. Create Booking
in backend available to book many tickets
but let now in the frontend user can only book one ticket but be aware that this functionality can be changed in the future to book many events

Creates a new booking for an event.

- **URL**: `/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Admin Required**: No

#### Request Body
```json
{
    "eventId": 1,
    "numberOfTickets": 2
}
```

#### Response
```json
{
    "success": true,
    "message": "Booking created successfully",
    "data": {
        "id": 1,
        "userId": "user123",
        "eventId": 1,
        "bookingDate": "2024-03-20T10:00:00Z",
        "numberOfTickets": 2,
        "totalPrice": 100.00,
        "status": "Pending"
    }
}
```

### 5. Update Booking

Updates an existing booking.

- **URL**: `/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Admin Required**: No

#### Request Body
```json
{
    "numberOfTickets": 3,
    "status": "Confirmed"
}
```

#### Response
```json
{
    "success": true,
    "message": "Booking updated successfully",
    "data": {
        "id": 1,
        "userId": "user123",
        "eventId": 1,
        "bookingDate": "2024-03-20T10:00:00Z",
        "numberOfTickets": 3,
        "totalPrice": 150.00,
        "status": "Confirmed"
    }
}
```

### 6. Delete Booking

Deletes a booking.

- **URL**: `/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Admin Required**: No

#### Response
```json
{
    "success": true,
    "message": "Booking deleted successfully"
}
```

### 7. Cancel Booking

Cancels an existing booking.

- **URL**: `/{id}/cancel`
- **Method**: `POST`
- **Auth Required**: Yes
- **Admin Required**: No

#### Response
```json
{
    "success": true,
    "message": "Booking cancelled successfully",
    "data": {
        "id": 1,
        "userId": "user123",
        "eventId": 1,
        "bookingDate": "2024-03-20T10:00:00Z",
        "numberOfTickets": 2,
        "totalPrice": 100.00,
        "status": "Cancelled"
    }
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

### 404 Not Found
```json
{
    "success": false,
    "message": "Booking not found",
    "errors": ["The requested booking does not exist"]
}
```

### 400 Bad Request
```json
{
    "success": false,
    "message": "Invalid request",
    "errors": ["Event not found", "Invalid number of tickets"]
}
```

## Status Codes

The booking status can be one of the following:
- `Pending`: Initial state when booking is created
- `Confirmed`: Booking has been confirmed
- `Cancelled`: Booking has been cancelled

## Notes

1. All timestamps are in UTC format
2. Prices are in decimal format with 2 decimal places
3. The total price is calculated based on the event price and number of tickets
4. Only the booking owner or an admin can update/cancel/delete a booking
5. Pagination is implemented for list endpoints with a default page size of 10 items 



how the booking status functionality would work from a frontend perspective:
1. Creating a Booking (Status: Pending)
- User browses available events
- Selects an event they want to book
- go to details page
- Submits the booking
- Frontend shows a confirmation message that booking is "Pending"
- User can see their booking in their bookings list with "Pending" status
2. Viewing Booking Status
- User has a "My Bookings" section in their profile/dashboard
- Each booking shows:
    - Event details
    - Number of tickets
    - Total price
    - Current status (Pending/Confirmed/Cancelled)
    - Booking date
- Status is visually indicated (e.g., different colors for different statuses)
3. Admin Panel for Managing Bookings
- Admin has a separate dashboard to manage all bookings
- Can see all bookings with their current status
- Has ability to:
    - View booking details
    - Change status from "Pending" to "Confirmed"
    - Cancel bookings if needed
- Can filter bookings by status
4. Status Change
- When a booking status changes:
    - Status update is reflected in real-time in the UI
    - Booking card/entry updates to show new status
    - Color coding changes to reflect new status
5. User Actions Based on Status
- Pending Status:
    - User can view booking details
    - Can cancel the booking
    - Shows "Waiting for confirmation" message
- Confirmed Status:
    - User can view booking details
    - Can download tickets (if applicable)
    - Can cancel the booking
    - Shows "Booking Confirmed" message
- Cancelled Status:
    - User can view booking details
    - Shows "Booking Cancelled" message

6. Status Change Flow
- User Cancellation:
    - User clicks "Cancel Booking" button
    - Confirmation popup appears
    - User confirms cancellation
    - Status changes to "Cancelled"
    - UI updates to show cancelled status
    - User receives cancellation confirmation
- Admin Confirmation:
    - Admin views pending bookings
    - Clicks "Confirm Booking" button
    - Status changes to "Confirmed"
    - User's UI updates to show confirmed status
7. Visual Indicators
- Pending: Yellow/Orange color scheme
- Confirmed: Green color scheme
- Cancelled: Red color scheme
- Status badges/icons for quick visual reference
- Progress indicators for status changes