import { User } from './user.model';

export interface UserProfile extends User {
  firstName: string;
  lastName: string;
  userName: string;
}

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
} 