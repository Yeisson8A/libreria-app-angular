import { Routes } from '@angular/router';
import { LibroListComponent } from './pages/libro-list/libro-list.component';
import { LibroFormComponent } from './pages/libro-form/libro-form.component';

export const LIBROS_ROUTES: Routes = [
  { path: '', component: LibroListComponent },
  { path: 'nuevo', component: LibroFormComponent },
  { path: 'editar/:id', component: LibroFormComponent }
];