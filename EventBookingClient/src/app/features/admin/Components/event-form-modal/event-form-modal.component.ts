import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../../../core/services/event.service';
import { CategoryService } from '../../../../core/services/category.service';
import { EventCreateDto } from '../../../../core/models/event.model';
import { FileSizePipe } from '../../../../shared/pipes/file-size.pipe';

@Component({
  selector: 'app-event-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileSizePipe],
  templateUrl: './event-form-modal.component.html',
  styleUrls: ['./event-form-modal.component.scss']
})
export class EventFormModalComponent {
  @Input() isOpen = false;
  @Input() isDarkMode = false;
  @Output() close = new EventEmitter<void>();
  @Output() eventCreated = new EventEmitter<void>();

  eventForm: FormGroup;
  categories: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  imageError: string | null = null;

  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  readonly ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private categoryService: CategoryService
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      venue: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0), Validators.max(10000)]]
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories. Please try again.';
      }
    });
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.imageError = null;

      // Validate file type
      if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
        this.imageError = 'Please select a valid image file (JPEG, PNG, or WebP)';
        input.value = '';
        return;
      }

      // Validate file size
      if (file.size > this.MAX_FILE_SIZE) {
        this.imageError = 'Image size should not exceed 5MB';
        input.value = '';
        return;
      }

      this.selectedImage = file;
      this.createImagePreview();
    }
  }

  createImagePreview(): void {
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.onerror = () => {
        this.imageError = 'Error reading the image file';
        this.imagePreview = null;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
    this.imageError = null;
    const input = document.getElementById('image') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const formData: EventCreateDto = {
        ...this.eventForm.value,
        img: this.selectedImage || undefined
      };

      this.eventService.createEvent(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.eventCreated.emit();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating event:', error);
          this.isLoading = false;
          this.errorMessage = 'Failed to create event. Please try again.';
        }
      });
    }
  }

  closeModal(): void {
    this.eventForm.reset();
    this.removeImage();
    this.errorMessage = null;
    this.close.emit();
  }
} 