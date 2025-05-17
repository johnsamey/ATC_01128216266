import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { DashboardStatistics, BookingWithDetails } from '../models/dashboard-statistics.model';
import { EventService } from './event.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.apiUrl}/statistics`;

  constructor(
    private http: HttpClient,
    private eventService: EventService,
    private userService: UserService
  ) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getDashboardStatistics(): Observable<ApiResponse<DashboardStatistics>> {
    return this.http.get<ApiResponse<DashboardStatistics>>(this.apiUrl).pipe(
      switchMap(response => {
        if (response.success && response.data) {
          // Create an array of observables to fetch event and user details
          const bookingDetailsObservables = response.data.recentBookings.map(booking => {
            const eventObs = this.eventService.getEventById(booking.eventId).pipe(
              catchError(error => {
                console.error(`Error fetching event ${booking.eventId}:`, error);
                return of({ success: false, data: null, message: 'Failed to fetch event details' });
              })
            );

            const userObs = this.userService.getUserById(booking.userId.toString()).pipe(
              catchError(error => {
                console.error(`Error fetching user ${booking.userId}:`, error);
                return of({ success: false, data: null, message: 'Failed to fetch user details' });
              })
            );

            return forkJoin({
              event: eventObs,
              user: userObs
            }).pipe(
              map(({ event, user }) => ({
                ...booking,
                event: event.success ? event.data : null,
                user: user.success ? user.data : null
              } as BookingWithDetails))
            );
          });

          // Wait for all observables to complete
          return forkJoin(bookingDetailsObservables).pipe(
            map(bookingsWithDetails => ({
              ...response,
              data: {
                ...response.data,
                recentBookings: bookingsWithDetails
              }
            }))
          );
        }
        return [response];
      }),
      catchError(this.handleError)
    );
  }
} 