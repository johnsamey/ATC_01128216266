import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../core/services/event.service';
import { Event, EventQueryParams } from '../../../../core/models/event.model';
import { PagedResult } from '../../../../core/models/paged-result.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { environment } from '../../../../../environments/environment';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';
import { CategoryService, Category } from '../../../../core/services/category.service';
import { EventFormModalComponent } from '../../../admin/Components/event-form-modal/event-form-modal.component';
import { EventEditModalComponent } from '../../../admin/Components/event-edit-modal/event-edit-modal.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ToolbarComponent, 
    FormsModule,
    EventFormModalComponent,
    EventEditModalComponent,
    ConfirmationDialogComponent
  ]
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error: string | null = null;
  defaultImageUrl = 'assets/uploads/default-event.jpg';
  categories: Category[] = [];
  isDarkMode = false;
  private isBrowser: boolean;
  isAdmin = false;
  
  // Modal states
  showEventModal = false;
  showEditModal = false;
  showConfirmDialog = false;
  selectedEvent: Event | null = null;
  
  // Dialog properties
  dialogTitle = '';
  dialogMessage = '';
  dialogConfirmText = '';
  dialogConfirmClass = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;

  // Filters
  searchTerm = '';
  selectedCategoryId?: number;
  priceFilter = '';
  locationFilter = '';
  dateFilter = '';
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  locations = [
    'Convention Center, New York',
    'Grand Hotel, Chicago',
    'Modern Art Museum, Los Angeles',
    'Tech Hub, San Francisco',
    'Cloud Center, Seattle',
    'Tech Zone, Miami',
    'Data Hall, Boston',
    'Finance Center, Chicago',
    'Leadership Academy, Dallas',
    'Ecom Arena, San Diego',
    'Marketing Plaza, Atlanta',
    'BizHall, Phoenix',
    'Art Dome, Portland',
    'Studio 54, San Jose',
    'Art Yard, Detroit',
    'Canvas Center, Austin',
    'Craft Hall, Nashville',
    'Film House, Minneapolis',
    'Central Park, NYC',
    'Sports Arena, LA',
    'Sunset Beach, Hawaii',
    'Wellness Center, Sedona',
    'ClimbZone, Denver',
    'Jazz Club, New Orleans',
    'Rock Valley, Seattle',
    'Symphony Hall, Boston',
    'BeatBox Arena, Atlanta',
    'Country Grounds, Nashville',
    'Club X, Las Vegas',
    'Stadium Field, Houston',
    'Cairo',
    'CodeSpace, Denver',
    'Cairo',
    'Innovation Hub, NYC',
    'Cyber Arena, Austin',
  ];

  constructor(
    private eventService: EventService, 
    private categoryService: CategoryService,
    private authService: AuthService,
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
    this.loadEvents();
    this.loadCategories();
    this.checkAdminStatus();
  }

  checkAdminStatus(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.roles.includes('Admin') || false;
    });
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

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    const params: EventQueryParams = {
      page: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm,
      categoryId: this.selectedCategoryId,
      startDate: this.startDate,
      endDate: this.endDate,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    };

    this.eventService.getEvents(params).subscribe({
      next: (response: ApiResponse<PagedResult<Event>>) => {
        if (response.success) {
          this.events = response.data.items;
          this.totalItems = response.data.totalCount;
          this.totalPages = response.data.totalPages;
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load events. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: ApiResponse<Category[]>) => {
        if (response.success) {
          this.categories = response.data;
        } else {
          console.error('Failed to load categories:', response.message);
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  getEventImage(imageUrl: string | null): string {
    if (!imageUrl) {
      return this.defaultImageUrl;
    }
    // If the imageUrl already starts with /event-images, return it as is
    if (imageUrl.startsWith('/event-images/')) {
      return imageUrl;
    }
    // Otherwise, prepend /event-images to the path
    return `/event-images/${imageUrl}`;
  }

  handleImageError(event: ErrorEvent): void {
    const imgElement = event.target as HTMLImageElement;
    console.log('Image load error for URL:', imgElement.src);
    
    if (imgElement.src !== this.defaultImageUrl) {
      console.log('Setting default image');
      imgElement.src = this.defaultImageUrl;
    } else {
      console.log('Already using default image, not setting again');
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEvents();
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.loadEvents();
  }

  onCategoryChange(categoryId: number | undefined): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;
    this.loadEvents();
  }

  onPriceFilterChange(value: string): void {
    switch (value) {
      case 'under50':
        this.minPrice = 0;
        this.maxPrice = 50;
        break;
      case 'under100':
        this.minPrice = 0;
        this.maxPrice = 100;
        break;
      case 'under200':
        this.minPrice = 0;
        this.maxPrice = 200;
        break;
      case 'over200':
        this.minPrice = 200;
        this.maxPrice = undefined;
        break;
      default:
        this.minPrice = undefined;
        this.maxPrice = undefined;
    }
    this.currentPage = 1;
    this.loadEvents();
  }

  onLocationFilterChange(value: string): void {
    // Update your location filter logic here
    this.currentPage = 1;
    this.loadEvents();
  }

  onDateFilterChange(value: string): void {
    const today = new Date();
    switch (value) {
      case 'today':
        this.startDate = today;
        this.endDate = today;
        break;
      case 'thisWeek':
        this.startDate = today;
        this.endDate = new Date(today.setDate(today.getDate() + 7));
        break;
      case 'thisMonth':
        this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'nextMonth':
        this.startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        this.endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        break;
      default:
        this.startDate = undefined;
        this.endDate = undefined;
    }
    this.currentPage = 1;
    this.loadEvents();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = undefined;
    this.priceFilter = '';
    this.locationFilter = '';
    this.dateFilter = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.startDate = undefined;
    this.endDate = undefined;
    this.currentPage = 1;
    this.loadEvents();
  }

  // Admin methods
  openEventModal(): void {
    this.showEventModal = true;
  }

  closeEventModal(): void {
    this.showEventModal = false;
  }

  onEventCreated(): void {
    this.closeEventModal();
    this.loadEvents();
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
    this.loadEvents();
  }

  deleteEvent(eventId: number): void {
    this.dialogTitle = 'Delete Event';
    this.dialogMessage = 'Are you sure you want to delete this event?';
    this.dialogConfirmText = 'Delete';
    this.dialogConfirmClass = 'btn-danger';
    this.showConfirmDialog = true;
    this.selectedEvent = this.events.find(e => e.id === eventId) || null;
  }

  onConfirmAction(): void {
    if (this.selectedEvent) {
      this.eventService.deleteEvent(this.selectedEvent.id).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.error = 'Failed to delete event. Please try again.';
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
    this.selectedEvent = null;
  }
} 