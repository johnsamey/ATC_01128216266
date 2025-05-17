# Event Booking System Frontend

This project is the frontend for the Event Booking System, built with Angular 17+.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup Instructions

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd EvenBookingSystem/EventBookingClient
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URL in `src/environments/environment.ts` if needed:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: '/api',
     defaultLanguage: 'en',
     supportedLanguages: ['en', 'ar']
   };
   ```

4. Start the development server:
   ```bash
   ng serve
   ```

   The application will be available at `http://localhost:4200`.

## Project Structure

```
EventBookingClient/
├── src/                    # Source code
│   ├── app/               # Application code
│   ├── assets/            # Static assets
│   └── environments/      # Environment configurations
├── public/                # Public assets
└── ...                   # Configuration files
```

## Scripts

- `ng serve`: Start the development server
- `ng build`: Build the project for production


## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Material](https://material.angular.io/)
- [Font Awesome](https://fontawesome.com/) 