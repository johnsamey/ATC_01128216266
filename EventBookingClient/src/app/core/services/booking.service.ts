import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Booking } from '../models/booking.model';
import { PagedResult } from '../models/paged-result.model';
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/booking`;

  constructor(private http: HttpClient) {}

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

  getBookingById(id: number): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllBookings(page: number = 1, pageSize: number = 10, status?: string): Observable<ApiResponse<PagedResult<Booking>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<PagedResult<Booking>>>(`${this.apiUrl}/`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getUserBookings(page: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResult<Booking>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PagedResult<Booking>>>(`${this.apiUrl}/user`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getUserBookingsWithFilters(params: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
    status?: string;
    categoryId?: number;
    sortBy?: string;
  }): Observable<ApiResponse<PagedResult<Booking>>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.categoryId) httpParams = httpParams.set('categoryId', params.categoryId.toString());
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    return this.http.get<ApiResponse<PagedResult<Booking>>>(
      `${this.apiUrl}/user`, { params: httpParams }
    ).pipe(
      catchError(this.handleError)
    );
  }

  createBooking(eventId: number, numberOfTickets: number = 1): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(`${this.apiUrl}`, {
      eventId,
      numberOfTickets
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateBooking(id: number, data: { numberOfTickets?: number, status?: string }): Observable<ApiResponse<Booking>> {
    if (data.status === 'Confirmed') {
      data.numberOfTickets = 1;
    }
    return this.http.put<ApiResponse<Booking>>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteBooking(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  cancelBooking(id: number): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(`${this.apiUrl}/${id}/cancel`, {}).pipe(
      catchError(this.handleError)
    );
  }

  getRecentBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/recent`).pipe(
      catchError(this.handleError)
    );
  }
} 