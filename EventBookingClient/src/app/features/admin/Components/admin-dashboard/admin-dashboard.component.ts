import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { EventFormModalComponent } from '../event-form-modal/event-form-modal.component';
import { EventService } from '../../../../core/services/event.service';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { DashboardStatistics } from '../../../../core/models/dashboard-statistics.model';
import { EventEditModalComponent } from '../event-edit-modal/event-edit-modal.component';
import { Event } from '../../../../core/models/event.model';
import { BookingService } from '../../../../core/services/booking.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Booking } from '../../../../core/models/booking.model';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ToolbarComponent, EventFormModalComponent, EventEditModalComponent, ConfirmationDialogComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  statistics: DashboardStatistics = {
    totalBookings: 0,
    totalEvents: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentBookings: [],
    upcomingEvents: []
  };
  isLoading = false;
  errorMessage: string | null = null;
  isDarkMode = false;
  showEventModal = false;
  showEditModal = false;
  selectedEvent: Event | null = null;


  showConfirmDialog = false;
  showCancelDialog = false;
  selectedBookingId: number | null = null;
  dialogTitle = '';
  dialogMessage = '';
  dialogConfirmText = '';
  dialogConfirmClass = '';

  constructor(
    private bookingService: BookingService,
    private statisticsService: StatisticsService,
    private eventService: EventService
  ) {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.statisticsService.getDashboardStatistics().subscribe({
      next: (response) => {
        if (response.success) {
          this.statistics = response.data;
        } else {
          this.errorMessage = response.message;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.errorMessage = 'Failed to load dashboard data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  viewBookingDetails(bookingId: number): void {
    // TODO: Implement navigation to booking details
    console.log('View booking:', bookingId);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  openEventModal(): void {
    this.showEventModal = true;
  }

  closeEventModal(): void {
    this.showEventModal = false;
  }

  onEventCreated(): void {
    this.closeEventModal();
    this.loadDashboardData();
  }

  openEditModal(event: Event): void {
    this.selectedEvent = event;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.selectedEvent = null;
    this.showEditModal = false;
  }

  onEventUpdated(): void {
    this.closeEditModal();
    this.loadDashboardData();
  }

  editEvent(eventId: number): void {
    // TODO: Implement edit event functionality
    console.log('Edit event:', eventId);
  }

  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.loadDashboardData();
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.errorMessage = 'Failed to delete event. Please try again.';
        }
      });
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
            this.loadDashboardData();
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
            this.loadDashboardData();
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
} 