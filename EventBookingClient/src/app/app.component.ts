import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  standalone: true,
  imports: [RouterOutlet, RouterModule, FooterComponent]
})
export class AppComponent {
  title = 'event-booking-client';
}
