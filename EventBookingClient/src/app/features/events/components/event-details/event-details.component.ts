import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../../core/services/event.service';
import { BookingService } from '../../../../core/services/booking.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Event } from '../../../../core/models/event.model';
import { Booking } from '../../../../core/models/booking.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { PagedResult } from '../../../../core/models/paged-result.model';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ToolbarComponent],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  isBooking = false;
  bookingSuccess = false;
  bookingReference = '';
  defaultImageUrl = 'assets/uploads/default-event.jpg';
  isDarkMode = false;
  private isBrowser: boolean;
  userBooking: Booking | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private bookingService: BookingService,
    public authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadEventDetails();
    if (this.isBrowser) {
      this.isDarkMode = localStorage.getItem('theme') === 'dark';
    }
  }

  private loadEventDetails(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventById(Number(eventId)).subscribe({
        next: (response: ApiResponse<Event>) => {
          if (response.success && response.data) {
            this.event = response.data;
            if (this.isAuthenticated) {
              this.checkUserBooking();
            }
          }
        },
        error: (error) => {
          console.error('Error loading event:', error);
        }
      });
    }
  }

  private checkUserBooking(): void {
    if (!this.event) return;

    this.bookingService.getUserBookings().subscribe({
      next: (response: ApiResponse<PagedResult<Booking>>) => {
        if (response.success && response.data) {
          this.userBooking = response.data.items.find(
            booking => booking.eventId === this.event?.id
          ) || null;
        }
      },
      error: (error) => {
        console.error('Error checking user booking:', error);
      }
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // getEventImage(imageUrl: string): string {
  //   return imageUrl || this.defaultImageUrl;
  // }

  getEventImage(imageUrl: string | null): string {
    if (!imageUrl) {
      return this.defaultImageUrl;
    }
    if (imageUrl.startsWith('/event-images/')) {
      return imageUrl;
    }
    return `/event-images/${imageUrl}`;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isBrowser) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  returnToEvents(): void {
    this.router.navigate(['/events']);
  }

  bookEvent(): void {
    if (!this.event || this.isBooking) return;

    this.isBooking = true;
    this.bookingService.createBooking(this.event.id).subscribe({
      next: (response: ApiResponse<Booking>) => {
        this.bookingSuccess = true;
        this.bookingReference = response.data.id.toString();
        this.userBooking = response.data;
        this.isBooking = false;
      },
      error: (error) => {
        console.error('Error booking event:', error);
        this.isBooking = false;
      }
    });
  }

  confirmBooking(): void {
    if (!this.userBooking) return;

    this.isBooking = true;
    this.bookingService.updateBooking(this.userBooking.id, { status: 'Confirmed' }).subscribe({
      next: (response: ApiResponse<Booking>) => {
        this.userBooking = response.data;
        this.isBooking = false;
      },
      error: (error) => {
        console.error('Error confirming booking:', error);
        this.isBooking = false;
      }
    });
  }

  viewBookings(): void {
    this.router.navigate(['/profile/bookings']);
  }
} 