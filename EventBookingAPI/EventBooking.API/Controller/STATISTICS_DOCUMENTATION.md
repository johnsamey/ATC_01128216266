# Statistics API Documentation

This document provides information about the Statistics endpoints in the Event Booking API.

## Base URL

All endpoints are relative to: `/api/statistics`

## Authentication

All statistics endpoints require admin authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Get Statistics Overview

Retrieves a comprehensive overview of the system's statistics including total counts, revenue, recent bookings, and upcoming events.

**Endpoint:** `GET /api/statistics`

**Authorization:** Requires Admin Role

**Response:**
recentbooking: return last 10
upcoming events: return next 10
```json
{
    "success": true,
    "message": "Statistics retrieved successfully",
    "data": {
        "totalEvents": 42,
        "totalBookings": 156,
        "totalUsers": 89,
        "totalRevenue": 15678.50,
        "recentBookings": [
            {
                "id": 1,
                "eventId": 1,
                "userId": "user123",
                "numberOfTickets": 2,
                "totalPrice": 299.98,
                "bookingDate": "2024-03-15T10:30:00Z",
                "status": "Confirmed",
                "event": {
                    "id": 1,
                    "title": "Tech Conference 2024",
                    "description": "Annual technology conference",
                    "startDate": "2024-04-01T09:00:00Z",
                    "endDate": "2024-04-03T17:00:00Z",
                    "venue": "Convention Center",
                    "price": 149.99
                },
                "user": {
                    "id": "user123",
                    "userName": "john.doe",
                    "email": "john.doe@example.com",
                    "firstName": "John",
                    "lastName": "Doe"
                }
            }
            // ... more recent bookings
        ],
        "upcomingEvents": [
            {
                "id": 1,
                "title": "Tech Conference 2024",
                "description": "Annual technology conference",
                "categoryId": 1,
                "categoryName": "Technology",
                "startDate": "2024-04-01T09:00:00Z",
                "endDate": "2024-04-03T17:00:00Z",
                "venue": "Convention Center",
                "price": 149.99,
                "imageUrl": "/uploads/tech-conference.jpg",
                "tags": [
                    {
                        "id": 1,
                        "name": "Conference"
                    }
                ],
                "isBooked": false
            }
            // ... more upcoming events
        ]
    },
    "errors": null
}
```

**Response Fields:**
- `totalEvents`: Total number of events in the system
- `totalBookings`: Total number of bookings made
- `totalUsers`: Total number of registered users
- `totalRevenue`: Total revenue from all bookings
- `recentBookings`: List of the 10 most recent bookings with full details
- `upcomingEvents`: List of the next 10 upcoming events with full details

**Error Response:**
```json
{
    "success": false,
    "message": "Failed to get statistics",
    "data": null,
    "errors": [
        "Error message details"
    ]
}
```

**Possible Error Codes:**
- `401 Unauthorized`: If the user is not authenticated
- `403 Forbidden`: If the user is not an admin
- `500 Internal Server Error`: If there's an error processing the request

## Notes

1. The statistics endpoint provides a comprehensive overview of the system's current state
2. Recent bookings are ordered by booking date (most recent first)
3. Upcoming events are ordered by start date (soonest first)
4. All monetary values are in the system's base currency
5. The endpoint is optimized to return the most relevant information for dashboard displays 