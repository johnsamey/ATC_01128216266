import { Event } from './event.model';
import { UserProfile } from './user-profile.model';

export interface Booking {
  id: number;
  userId: string;
  eventId: number;
  bookingDate: Date;
  numberOfTickets: number;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  event?: Event; 
  user?: UserProfile;
} 