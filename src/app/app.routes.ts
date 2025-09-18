import { Routes } from '@angular/router';
import { JsonViewerComponent } from './shared/components/json-viewer/json-viewer.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'node-layout',
    pathMatch: 'full',
  },
  {
    path: 'node-layout',
    loadComponent: () => import('./pages/nodelayout/nodelayout.component').then((m) => m.NodelayoutComponent),
  },
];
