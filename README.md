# Event Booking System

A modern web application for managing event bookings, built with Angular and .NET Core using Clean Architecture.

## Features

- User authentication and authorization
- Event creation and management
- Booking system with status tracking
- Responsive design with dark mode support
- Real-time booking status updates
- Search and filter functionality
- Booking statistics and analytics

## Tech Stack

### Frontend
- Angular 17+
- SCSS for styling
- Angular Material
- Font Awesome icons
- Responsive design

### Backend
- .NET Core 8
- Clean Architecture
- Entity Framework Core
- PostgreSQL Server
- JWT Authentication
- FluentValidation
- AutoMapper

## Deployment

The application is currently deployed on AWS EC2 with the following configuration:
- Web Server: Nginx
- Live URL: [https://eventbooking.ddns.net/events](https://eventbooking.ddns.net/events)

### Performance Considerations
The current deployment has some performance limitations due to:
- Server location being far from target users
- Multiple processes/websites running on the same instance
- Limited server specifications

These factors may result in slower response times


## Prerequisites

- Node.js (v18 or higher)
- .NET Core SDK 8.0
- PostgreSQL Server
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd EvenBookingSystem
```

### 2. Backend Setup

For detailed backend setup instructions, refer to the [Backend README](EventBookingAPI/README.md).

### 3. Frontend Setup

For detailed frontend setup instructions, refer to the [Frontend README](EventBookingClient/README.md).

### 4. Collaborating Frontend and Backend

1. **Start the Backend Server**:
   - After complete backend setup:
     ```bash
     cd EventBookingAPI
     ```
   - Start the backend server:
     ```bash
     dotnet run
     ```
   - The API will be available at `https://localhost:Port`.

2. **Start the Frontend Server**:
   - After complete frontend setup:
     ```bash
     cd EventBookingClient
     ```
   - Start the frontend development server:
     ```bash
     ng serve
     ```
   - The application will be available at `http://localhost:4200`.

3. **Access the Application**:
   - Open your browser and navigate to `http://localhost:4200` to access the Event Booking System.

## Project Structure

```
EvenBookingSystem/
├── EventBookingAPI/           # Backend .NET Core project
│   ├── EventBooking.API/      # API Layer
│   ├── EventBooking.Application/ # Application Layer
│   ├── EventBooking.Domain/   # Domain Layer
│   └── EventBooking.Infrastructure/ # Infrastructure Layer
│
└── EventBookingClient/        # Frontend Angular project
    ├── src/                   # Source code
    ├── public/               # Static files
    └── ...                   # Configuration files
```

## Scripts

### Backend
- `dotnet run`: Start the development server
- `dotnet publish -c Release -o publish`: Build for production

### Frontend
- `ng serve`: Start the development server
- `ng build`: Build the project for production

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Material](https://material.angular.io/)
- [Font Awesome](https://fontawesome.com/)
- [.NET Core Documentation](https://docs.microsoft.com/en-us/dotnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [PostgreSQL](https://www.postgresql.org/docs/) 