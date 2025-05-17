import { Event } from './event.model';
import { Booking } from './booking.model';
import { UserProfile } from './user-profile.model';

export interface BookingWithDetails extends Omit<Booking, 'event' | 'user'> {
  event: Event | null;
  user: UserProfile | null;
}

export interface DashboardStatistics {
  totalEvents: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  recentBookings: BookingWithDetails[];
  upcomingEvents: Event[];
} 