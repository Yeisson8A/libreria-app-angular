import { Routes } from '@angular/router';
import { PrestamoListComponent } from './pages/prestamo-list/prestamo-list.component';
import { PrestamoFormComponent } from './pages/prestamo-form/prestamo-form.component';

export const PRESTAMOS_ROUTES: Routes = [
  { path: '', component: PrestamoListComponent },
  { path: 'nuevo', component: PrestamoFormComponent }
];