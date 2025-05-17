import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoryService, Category } from '../../../../core/services/category.service';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.css']
})
export class EventFilterComponent implements OnInit {
  @Output() categoryChange = new EventEmitter<number | undefined>();
  
  categories: Category[] = [];
  selectedCategoryId?: number;
  loading = false;
  error: string | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories. Please try again later.';
        this.loading = false;
      }
    });
  }

  onCategorySelect(categoryId: number | undefined): void {
    this.selectedCategoryId = categoryId;
    this.categoryChange.emit(categoryId);
  }
} 