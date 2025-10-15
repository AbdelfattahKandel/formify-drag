import { Routes } from '@angular/router';
import { JsonViewerComponent } from './shared/components/json-viewer/json-viewer.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'get-started',
    pathMatch: 'full',
  },
  {
    path: 'get-started',
    loadComponent: () => import('./pages/get-started/components/welcome/welcome.component').then((m) => m.WelcomePageComponent),
  },
  {
    path: 'get-started/setup-stepper',
    loadComponent: () => import('./pages/get-started/components/welcome/setup-stepper/setup-stepper.component').then((m) => m.SetupStepperComponent),
  },
  {
    path: 'node-layout',
    loadComponent: () => import('./pages/nodelayout/nodelayout.component').then((m) => m.NodelayoutComponent),
  },
];
