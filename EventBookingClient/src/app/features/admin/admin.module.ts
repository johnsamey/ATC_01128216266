import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { AdminBookingsComponent } from './Components/admin-bookings/admin-bookings.component';
import { AdminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'bookings',
    component: AdminBookingsComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { } 