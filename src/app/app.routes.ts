import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'libros',
        loadChildren: () =>
          import('./features/libros/libros.routes')
            .then(m => m.LIBROS_ROUTES)
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./features/usuarios/usuarios.routes')
            .then(m => m.USUARIOS_ROUTES)
      },
      {
        path: 'prestamos',
        loadChildren: () =>
          import('./features/prestamos/prestamos.routes')
            .then(m => m.PRESTAMOS_ROUTES)
      },
      {
        path: '',
        redirectTo: 'libros',
        pathMatch: 'full'
      }
    ]
  }
];
