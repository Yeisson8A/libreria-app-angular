import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Prestamo } from '../models/prestamo.model';
import { CrearPrestamoRequest } from '../models/crear-prestamo-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private api = inject(ApiService);
  private endpoint = 'prestamos';

  // Listar préstamos
  listar(): Observable<Prestamo[]> {
    return this.api.get<Prestamo[]>(this.endpoint);
  }

  // Obtener préstamo por ID
  obtener(id: number): Observable<Prestamo> {
    return this.api.get<Prestamo>(`${this.endpoint}/${id}`);
  }

  // Prestar libro
  prestar(request: CrearPrestamoRequest): Observable<Prestamo> {
    return this.api.post<Prestamo>(this.endpoint, request);
  }

  // Devolver libro
  devolver(id: number): Observable<Prestamo> {
    return this.api.put<Prestamo>(`${this.endpoint}/devolver/${id}`, {});
  }
}