import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../core/services/event.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Event as EventModel } from '../../../../core/models/event.model';

@Component({
  selector: 'app-event-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-edit-modal.component.html',
  styleUrls: ['./event-edit-modal.component.scss']
})
export class EventEditModalComponent implements OnInit {
  @Input() isOpen = false;
  private _event: EventModel | null = null;
  @Input() set event(value: EventModel | null) {
    this._event = value;
    if (value) {
      this.populateForm();
    }
  }
  get event(): EventModel | null {
    return this._event;
  }
  @Input() isDarkMode = false;
  @Output() close = new EventEmitter<void>();
  @Output() eventUpdated = new EventEmitter<EventModel>();

  eventForm: FormGroup;
  categories: any[] = [];
  error: string | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  
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
      price: [0, [Validators.required, Validators.min(0)]],
      image: [null]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  private populateForm() {
    if (this.event) {
      const startDate = new Date(this.event.startDate);
      const endDate = new Date(this.event.endDate);
      
      const formattedStartDate = this.formatDateForInput(startDate);
      const formattedEndDate = this.formatDateForInput(endDate);

      this.eventForm.patchValue({
        title: this.event.title,
        description: this.event.description,
        categoryId: this.event.categoryId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        venue: this.event.venue,
        price: this.event.price
      });

      // Set image preview if exists
      if (this.event.imageUrl) {
        this.imagePreview = this.event.imageUrl;
      }

      // Mark form as pristine after populating
      this.eventForm.markAsPristine();
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private formatDateForBackend(date: Date): string {
    return date.toISOString();
  }

  private compareDates(date1: any, date2: any): boolean {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getTime() === d2.getTime();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories';
      }
    });
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.error = 'Image size should not exceed 5MB';
        return;
      }
      this.selectedFile = file;
      this.createImagePreview(file);
    }
  }

  createImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imagePreview = null;
    this.selectedFile = null;
    this.eventForm.patchValue({ image: null });
  }

  onSubmit() {
    console.group('Event Edit Form Submission');
    console.log('Form Status:', {
      valid: this.eventForm.valid,
      invalid: this.eventForm.invalid,
      pristine: this.eventForm.pristine,
      dirty: this.eventForm.dirty,
      touched: this.eventForm.touched
    });

    if (this.eventForm.invalid || !this.event) {
      console.warn('Form submission blocked:', {
        isFormInvalid: this.eventForm.invalid,
        hasEvent: !!this.event,
        formErrors: this.eventForm.errors,
        controlErrors: this.getFormControlErrors()
      });
      console.groupEnd();
      return;
    }

    this.isLoading = true;
    this.error = null;
    console.log('Starting form submission process');

    const formData = new FormData();
    const formValue = this.eventForm.value;
    console.log('Form Values:', formValue);

    // Only append fields that have been changed
    Object.keys(formValue).forEach(key => {
      // Skip the image field as we'll handle it separately
      if (key === 'image') return;

      const currentValue = this.event?.[key as keyof EventModel];
      const newValue = formValue[key];
      
      // Special handling for dates
      if (key === 'startDate' || key === 'endDate') {
        const hasChanged = !this.compareDates(currentValue, newValue);
        console.log(`Checking date field "${key}":`, {
          currentValue,
          newValue,
          hasChanged
        });

        if (hasChanged) {
          const formattedDate = this.formatDateForBackend(new Date(newValue));
          console.log(`Appending changed date "${key}":`, formattedDate);
          formData.append(key, formattedDate);
        }
        } else {
        console.log(`Checking field "${key}":`, {
          currentValue,
          newValue,
          hasChanged: newValue !== currentValue
        });

        if (newValue !== currentValue) {
          console.log(`Appending changed field "${key}":`, newValue);
          formData.append(key, newValue);
        }
      }
    });

    // Handle image separately - only send the filename
    if (this.selectedFile) {
      const imageFileName = this.selectedFile.name;
      console.log('Appending image filename:', imageFileName);
      formData.append('image', imageFileName);
    } else if (this.imagePreview && !this.selectedFile) {
      // If there's an existing image and no new file selected, keep the existing image
      console.log('Keeping existing image:', this.imagePreview);
      formData.append('keepExistingImage', 'true');
    }

    console.log('Final FormData contents:', this.getFormDataContents(formData));

    this.eventService.updateEvent(this.event.id.toString(), formData).subscribe({
      next: (response) => {
        console.log('Event update successful:', response);
        this.isLoading = false;
        this.eventUpdated.emit(response.data);
        this.closeModal();
        console.groupEnd();
      },
      error: (error) => {
        console.error('Error updating event:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        this.isLoading = false;
        this.error = error.error?.message || 'Failed to update event';
        console.groupEnd();
      }
    });
  }

  // Helper method to get form control errors
  private getFormControlErrors(): { [key: string]: any } {
    const errors: { [key: string]: any } = {};
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  // Helper method to log FormData contents
  private getFormDataContents(formData: FormData): { [key: string]: any } {
    const contents: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      contents[key] = value instanceof File ? {
        name: (value as File).name,
        size: (value as File).size,
        type: (value as File).type
      } : value;
    });
    return contents;
  }

  closeModal() {
    this.eventForm.reset();
    this.imagePreview = null;
    this.selectedFile = null;
    this.error = null;
    this.close.emit();
  }
} 