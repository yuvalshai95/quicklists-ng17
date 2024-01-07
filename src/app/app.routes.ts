import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'), // component is exported as default
  },
  {
    path: 'checklist/:id',
    loadComponent: () => import('./checklist/checklist.component'), // component is exported as default
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
