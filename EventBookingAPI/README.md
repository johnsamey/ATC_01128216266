# Event Booking System Backend

This project is the backend for the Event Booking System, built with .NET Core 8 using Clean Architecture.

## Prerequisites

- .NET Core SDK 8.0
- PostgreSQL Server
- Git

## Setup Instructions

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd EvenBookingSystem/EventBookingAPI
   ```

2. Install dependencies:
   ```bash
   dotnet restore
   ```

3. Update the database connection string in `EventBooking.API/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=EventBookingDB;Username=your_username;Password=your_password"
     }
   }
   ```

4. If you are running the frontend and backend on different domains, you should handle CORS in `EventBooking.API/Program.cs`

5. Run database migrations:
   ```bash
   cd EventBooking.API
   dotnet ef database update
   ```

6. Start the backend server:
   ```bash
   dotnet run
   ```

   The API will be available at `https://localhost:Port`.


## Project Structure

```
EventBookingAPI/
├── EventBooking.API/           # API Layer
├── EventBooking.Application/   # Application Layer
├── EventBooking.Domain/        # Domain Layer
└── EventBooking.Infrastructure/# Infrastructure Layer
```

## Scripts

- `dotnet run`: Start the development server
- `dotnet publish -c Release -o publish`: Build for production

## Additional Resources

- [.NET Core Documentation](https://docs.microsoft.com/en-us/dotnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [PostgreSQL](https://www.postgresql.org/docs/) 