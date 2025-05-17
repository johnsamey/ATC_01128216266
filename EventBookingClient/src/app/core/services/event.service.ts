import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Event, EventCreateDto, EventQueryParams } from '../models/event.model';
import { PagedResult } from '../models/paged-result.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getEvents(params: EventQueryParams): Observable<ApiResponse<PagedResult<Event>>> {
    let httpParams = new HttpParams();
    
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
    if (params.searchTerm) {
      httpParams = httpParams.set('searchTerm', params.searchTerm);
    }
    if (params.categoryId) {
      httpParams = httpParams.set('categoryId', params.categoryId.toString());
    }
    if (params.startDate) {
      httpParams = httpParams.set('startDate', params.startDate.toISOString());
    }
    if (params.endDate) {
      httpParams = httpParams.set('endDate', params.endDate.toISOString());
    }
    if (params.minPrice) {
      httpParams = httpParams.set('minPrice', params.minPrice.toString());
    }
    if (params.maxPrice) {
      httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.sortDescending !== undefined) {
      httpParams = httpParams.set('sortDescending', params.sortDescending.toString());
    }

    return this.http.get<ApiResponse<PagedResult<Event>>>(this.apiUrl, { params: httpParams });
  }

  getEventById(id: number): Observable<ApiResponse<Event>> {
    return this.http.get<ApiResponse<Event>>(`${this.apiUrl}/${id}`);
  }

  createEvent(eventData: EventCreateDto): Observable<ApiResponse<Event>> {
    const formData = new FormData();
    
    // Append all event data to FormData
    Object.keys(eventData).forEach(key => {
      const value = eventData[key as keyof EventCreateDto];
      if (value !== undefined && value !== null) {
        if (key === 'img' && value instanceof File) {
          formData.append(key, value);
        } else if (key === 'tagIds' && Array.isArray(value)) {
          value.forEach(tagId => formData.append('tagIds', tagId.toString()));
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.http.post<ApiResponse<Event>>(this.apiUrl, formData);
  }

  deleteEvent(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  bookEvent(eventId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${eventId}/book`, {});
  }

  getUpcomingEvents(): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(`${this.apiUrl}/upcoming`).pipe(
      map(response => {
        if (response.success && response.data) {
          // Add bookingsCount to each event
          response.data = response.data.map(event => ({
            ...event,
            bookingsCount: event.bookingsCount || 0
          }));
        }
        return response;
      })
    );
  }

  updateEvent(id: string, eventData: FormData): Observable<ApiResponse<Event>> {
    return this.http.put<ApiResponse<Event>>(`${this.apiUrl}/${id}`, eventData);
  }
} 