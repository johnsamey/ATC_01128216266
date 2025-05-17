import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { AdminDashboardComponent } from './admin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'events/create',
    loadChildren: () => import('../event-form/event-form.module').then(m => m.EventFormModule)
  },
  {
    path: 'events/edit/:id',
    loadChildren: () => import('../event-form/event-form.module').then(m => m.EventFormModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminDashboardModule { } 