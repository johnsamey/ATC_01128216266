import { Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { UnifiedAuthComponent } from './features/auth/components/unified-auth/unified-auth.component';
import { UnauthorizedComponent } from './features/error/unauthorized/unauthorized.component';
import { NotFoundComponent } from './features/error/not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: UnifiedAuthComponent
  },
  {
    path: 'events',
    loadChildren: () => import('./features/events/events.module').then(m => m.EventsModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '',
    redirectTo: '/events',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/not-found'
  }
];
