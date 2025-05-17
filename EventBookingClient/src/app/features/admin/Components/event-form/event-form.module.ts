import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { EventFormComponent } from './event-form.component';

const routes: Routes = [
  {
    path: '',
    component: EventFormComponent
  }
];

@NgModule({
  declarations: [
    EventFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    EventFormComponent
  ]
})
export class EventFormModule { } 