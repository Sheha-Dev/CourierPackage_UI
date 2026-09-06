import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Full } from './layout/full/full';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'home',
    component: Full,

    children: [
      {
        path: '',

        loadComponent: () =>
          import('./pages/home/home')
            .then(m => m.Home)
      }
      ,
      {
        path: 'user-package',

        loadComponent: () =>
          import('./pages/user/package/package')
            .then(m => m.Package)
      },

      {
        path: 'user-recipient',

        loadComponent: () =>
          import('./pages/user/recipient/recipient')
            .then(m => m.Recipient)
      },

      {
        path: 'admin-package',

        loadComponent: () =>
          import('./pages/admin/package/package')
            .then(m => m.Package)
      },

      {
        path: 'employee',

        loadComponent: () =>
          import('./pages/admin/employee/employee')
            .then(m => m.Employee)
      },

      {
        path: 'role',

        loadComponent: () =>
          import('./pages/admin/role/role')
            .then(m => m.Role)
      },

      {
        path: 'warehouse',

        loadComponent: () =>
          import('./pages/admin/warehouse/warehouse')
            .then(m => m.Warehouse)
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];