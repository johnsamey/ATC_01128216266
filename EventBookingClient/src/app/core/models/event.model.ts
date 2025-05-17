export interface Event {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  categoryName: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  price: number;
  imageUrl: string;
  tags: Tag[];
  isBooked: boolean;
  bookingsCount?: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface EventCreateDto {
  title: string;
  description: string;
  categoryId: number;
  startDate: Date;
  endDate: Date;
  venue: string;
  price: number;
  img?: File;
  tagIds?: number[];
}



export interface EventQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: number;
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'date' | 'popularity';
  sortDescending?: boolean;
} 