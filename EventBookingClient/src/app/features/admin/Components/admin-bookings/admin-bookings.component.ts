import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../../core/services/booking.service';
import { EventService } from '../../../../core/services/event.service';
import { UserService } from '../../../../core/services/user.service';
import { Booking } from '../../../../core/models/booking.model';
import { Event } from '../../../../core/models/event.model';
import { UserProfile } from '../../../../core/models/user-profile.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { PagedResult } from '../../../../core/models/paged-result.model';

interface BookingWithDetails extends Booking {
  event?: Event;
  user?: UserProfile;
}

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToolbarComponent, ConfirmationDialogComponent],
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.scss']
})
export class AdminBookingsComponent implements OnInit {
  bookings: BookingWithDetails[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  statusFilter = '';
  isDarkMode = false;

  // Confirmation dialog state
  showConfirmDialog = false;
  showCancelDialog = false;
  selectedBookingId: number | null = null;
  dialogTitle = '';
  dialogMessage = '';
  dialogConfirmText = '';
  dialogConfirmClass = '';

  constructor(
    private bookingService: BookingService,
    private eventService: EventService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
  }

  loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.getAllBookings(this.currentPage, this.pageSize, this.statusFilter).subscribe({
      next: (response: ApiResponse<PagedResult<Booking>>) => {
        if (response.success && response.data) {
          // Fetch event and user details for each booking
          const bookingsWithDetails = response.data.items.map(booking => {
            const bookingWithDetails: BookingWithDetails = { ...booking };
            
            // Fetch event details
            this.eventService.getEventById(booking.eventId).subscribe({
              next: (eventResponse: ApiResponse<Event>) => {
                if (eventResponse.success && eventResponse.data) {
                  bookingWithDetails.event = eventResponse.data;
                }
              },
              error: (error) => {
                console.error(`Error fetching event ${booking.eventId}:`, error);
              }
            });

            // Fetch user details
            this.userService.getUserById(booking.userId.toString()).subscribe({
              next: (userResponse: ApiResponse<UserProfile>) => {
                if (userResponse.success && userResponse.data) {
                  bookingWithDetails.user = userResponse.data;
                }
              },
              error: (error) => {
                console.error(`Error fetching user ${booking.userId}:`, error);
              }
            });

            return bookingWithDetails;
          });

          this.bookings = bookingsWithDetails;
          this.totalPages = Math.ceil(response.data.totalCount / response.data.pageSize);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load bookings. Please try again.';
        this.isLoading = false;
        console.error('Error loading bookings:', error);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBookings();
    }
  }

  confirmBooking(bookingId: number): void {
    this.selectedBookingId = bookingId;
    this.dialogTitle = 'Confirm Booking';
    this.dialogMessage = 'Are you sure you want to confirm this booking?';
    this.dialogConfirmText = 'Confirm';
    this.dialogConfirmClass = 'btn-success';
    this.showConfirmDialog = true;
  }

  cancelBooking(bookingId: number): void {
    this.selectedBookingId = bookingId;
    this.dialogTitle = 'Cancel Booking';
    this.dialogMessage = 'Are you sure you want to cancel this booking?';
    this.dialogConfirmText = 'Cancel';
    this.dialogConfirmClass = 'btn-danger';
    this.showCancelDialog = true;
  }

  onConfirmAction(): void {
    if (this.selectedBookingId === null) return;

    if (this.showConfirmDialog) {
      this.bookingService.updateBooking(this.selectedBookingId, { status: 'Confirmed'}).subscribe({
        next: (response: ApiResponse<Booking>) => {
          if (response.success) {
            this.loadBookings();
          }
        },
        error: (error) => {
          console.error('Error confirming booking:', error);
          alert('Failed to confirm booking. Please try again.');
        }
      });
    } else if (this.showCancelDialog) {
      this.bookingService.cancelBooking(this.selectedBookingId).subscribe({
        next: (response: ApiResponse<Booking>) => {
          if (response.success) {
            this.loadBookings();
          }
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
          alert('Failed to cancel booking. Please try again.');
        }
      });
    }

    this.closeDialogs();
  }

  onCancelAction(): void {
    this.closeDialogs();
  }

  private closeDialogs(): void {
    this.showConfirmDialog = false;
    this.showCancelDialog = false;
    this.selectedBookingId = null;
  }

  viewBookingDetails(bookingId: number): void {
    // TODO: Implement booking details view
    console.log('View booking details:', bookingId);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
} 