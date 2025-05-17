import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../../core/services/booking.service';
import { EventService } from '../../../../core/services/event.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Booking } from '../../../../core/models/booking.model';
import { Event } from '../../../../core/models/event.model';
import { UserProfile } from '../../../../core/models/user-profile.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { CategoryService, Category } from '../../../../core/services/category.service';

interface PaginatedResponse {
  items: Booking[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface BookingWithEvent extends Booking {
  event?: Event;
  user?: UserProfile;
}

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToolbarComponent, ConfirmationDialogComponent],
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.scss']
})
export class UserBookingsComponent implements OnInit {
  bookings: BookingWithEvent[] = [];
  filteredBookings: BookingWithEvent[] = [];
  categories: Category[] = [];
  isLoadingCategories = false;
  categoryError = '';
  isLoading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  isDarkMode = false;
  private isBrowser: boolean;
  defaultImageUrl = 'assets/uploads/default-event.jpg';
  bookingSuccess = false;
  bookingReference = '';
  // Dialog states
  showCancelDialog = false;
  showConfirmDialog = false;
  selectedBooking: BookingWithEvent | null = null;
  isCancelling = false;
  isConfirming = false;
  // Dialog state
  dialogTitle = '';
  dialogMessage = '';
  dialogConfirmText = '';
  dialogConfirmClass = '';

  // View state
  isCalendarView = false;
  currentMonth = new Date();

  // Filters
  searchQuery = '';
  statusFilter = '';
  categoryFilter = '';
  sortBy = 'newest';

  // Statistics
  totalBookings = 0;
  totalSpent = 0;
  upcomingEvents = 0;
  pastEvents = 0;
  statusCounts = {
    pending: 0,
    confirmed: 0,
    cancelled: 0
  };

  // Calendar properties
  calendarDays: Date[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    private bookingService: BookingService,
    private eventService: EventService,
    private categoryService: CategoryService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
        document.body.classList.add('dark-theme');
      }
    }
    this.loadCategories();
    this.loadBookings();
  }

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        } else {
          this.categoryError = response.message;
        }
        this.isLoadingCategories = false;
      },
      error: (err) => {
        this.categoryError = 'Failed to load categories.';
        this.isLoadingCategories = false;
      }
    });
  }

  loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const params = {
      page: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchQuery || undefined,
      status: this.statusFilter || undefined,
      categoryId: this.categoryFilter ? parseInt(this.categoryFilter, 10) : undefined,
      sortBy: this.sortBy
    };

    this.bookingService.getUserBookingsWithFilters(params).pipe(
      switchMap(response => {
        if (response.success && response.data.items.length > 0) {
          this.totalPages = response.data.totalPages;
          this.totalBookings = response.data.totalCount;
          
          // Create an array of observables for event requests
          const eventRequests = response.data.items.map(booking => 
            this.eventService.getEventById(booking.eventId).pipe(
              map(eventResponse => ({
                ...booking,
                event: eventResponse.success ? eventResponse.data : undefined
              })),
              catchError(() => of({ ...booking, event: undefined }))
            )
          );

          // Use forkJoin to handle all event requests in parallel
          return forkJoin(eventRequests);
        }
        return of([]);
      })
    ).subscribe({
      next: (bookingsWithEvents) => {
        this.bookings = bookingsWithEvents;
        this.filteredBookings = bookingsWithEvents;
        this.calculateStatistics();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load bookings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  calculateStatistics(): void {
    const now = new Date();
    this.totalSpent = this.bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    this.upcomingEvents = this.bookings.filter(booking => 
      booking.event?.startDate && new Date(booking.event.startDate) > now
    ).length;
    this.pastEvents = this.bookings.filter(booking => 
      booking.event?.startDate && new Date(booking.event.startDate) <= now
    ).length;
    this.statusCounts = {
      pending: this.bookings.filter(b => b.status === 'Pending').length,
      confirmed: this.bookings.filter(b => b.status === 'Confirmed').length,
      cancelled: this.bookings.filter(b => b.status === 'Cancelled').length
    };
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadBookings();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.categoryFilter = '';
    this.sortBy = 'newest';
    this.currentPage = 1;
    this.loadBookings();
  }

  toggleView(): void {
    this.isCalendarView = !this.isCalendarView;
  }

  toggleCalendarView(): void {
    this.isCalendarView = !this.isCalendarView;
    if (this.isCalendarView) {
      this.generateCalendar();
    }
  }

  generateCalendar(): void {
    const start = startOfMonth(this.currentMonth);
    const end = endOfMonth(this.currentMonth);
    this.calendarDays = eachDayOfInterval({ start, end });
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  getEventsForDay(date: Date): Booking[] {
    return this.bookings.filter(booking => {
      const eventDate = new Date(booking.event?.startDate || '');
      return isSameDay(eventDate, date);
    });
  }

  isDayInCurrentMonth(date: Date): boolean {
    return isSameMonth(date, this.currentMonth);
  }

  isCurrentDay(date: Date): boolean {
    return isToday(date);
  }

  hasEventsOnDay(date: Date): boolean {
    return this.getEventsForDay(date).length > 0;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBookings();
    }
  }

  openCancelDialog(booking: Booking): void {
    this.selectedBooking = booking as BookingWithEvent;
    this.dialogTitle = 'Cancel Booking';
    this.dialogMessage = 'Are you sure you want to cancel this booking?';
    this.dialogConfirmText = 'Cancel';
    this.dialogConfirmClass = 'btn-danger';
    this.showCancelDialog = true;
  }

  closeCancelDialog(): void {
    this.showCancelDialog = false;
    this.selectedBooking = null;
    this.isCancelling = false;
  }

  confirmCancelBooking(): void {
    if (!this.selectedBooking) return;

    this.isCancelling = true;
    this.bookingService.cancelBooking(this.selectedBooking.id).subscribe({
      next: (response: ApiResponse<Booking>) => {
        if (response.success) {
          this.closeCancelDialog();
          this.loadBookings();
        }
      },
      error: (error) => {
        console.error('Error cancelling booking:', error);
        this.errorMessage = 'Failed to cancel booking. Please try again.';
        this.isCancelling = false;
      }
    });
  }

  openConfirmDialog(booking: Booking): void {
    this.selectedBooking = booking as BookingWithEvent;
    this.dialogTitle = 'Confirm Booking';
    this.dialogMessage = 'Are you sure you want to confirm this booking?';
    this.dialogConfirmText = 'Confirm';
    this.dialogConfirmClass = 'btn-success';
    this.showConfirmDialog = true;
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.selectedBooking = null;
    this.isConfirming = false;
  }

  confirmBooking(): void {
    if (!this.selectedBooking) return;

    this.isConfirming = true;
    this.bookingService.updateBooking(this.selectedBooking.id, { status: 'Confirmed' }).subscribe({
      next: (response: ApiResponse<Booking>) => {
        if (response.success) {
          this.closeConfirmDialog();
          this.bookingSuccess = true;
          this.bookingReference = response.data.id.toString();
          this.loadBookings();
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to confirm booking. Please try again.';
        this.isConfirming = false;
      }
    });
  }

  viewBookingDetails(bookingId: number): void {
    // Implement navigation to booking details page
  }

  toggleTheme(): void {
    if (this.isBrowser) {
      this.isDarkMode = !this.isDarkMode;
      if (this.isDarkMode) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  getEventImage(imageUrl: string|undefined): string {
    if (!imageUrl) {
      return this.defaultImageUrl;
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    if (imageUrl.startsWith('/uploads/')) {
      return `assets${imageUrl}`;
    }

    if (imageUrl.startsWith('assets/uploads/')) {
      return imageUrl;
    }

    return this.defaultImageUrl;
  }

  handleImageError(event: ErrorEvent): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement.src !== this.defaultImageUrl) {
      imgElement.src = this.defaultImageUrl;
    } else {
    }
  }

  onConfirmAction(): void {
    if (this.showConfirmDialog && this.selectedBooking) {
      this.confirmBooking();
    } else if (this.showCancelDialog && this.selectedBooking) {
      this.confirmCancelBooking();
    }
  }

  onCancelAction(): void {
    this.closeDialogs();
  }

  private closeDialogs(): void {
    this.showConfirmDialog = false;
    this.showCancelDialog = false;
    this.selectedBooking = null;
  }

  viewBookings(): void {
    this.bookingSuccess = false;
    this.bookingReference = '';
    this.loadBookings();
  }

  returnToEvents(): void {
    this.router.navigate(['/events']);
  }

  showDayEvents(date: Date): void {
    const events = this.getEventsForDay(date);
    if (events.length > 0) {
      // You can implement a modal or tooltip to show events
      console.log('Events for', date, events);
    }
  }
} 