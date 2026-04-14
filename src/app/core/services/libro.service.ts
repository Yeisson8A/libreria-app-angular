import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Libro } from '../models/libro.model';
import { CrearLibroRequest } from '../models/crear-libro-request.model';

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private api = inject(ApiService);
  private endpoint = 'libros';

  listar() {
    return this.api.get<Libro[]>(this.endpoint);
  }

  obtener(id: number) {
    return this.api.get<Libro>(`${this.endpoint}/${id}`);
  }

  crear(data: CrearLibroRequest) {
    return this.api.post<Libro>(this.endpoint, data);
  }

  actualizar(id: number, data: CrearLibroRequest) {
    return this.api.put<Libro>(`${this.endpoint}/${id}`, data);
  }

  eliminar(id: number) {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  buscar(query: string) {
    return this.api.get<Libro[]>(`${this.endpoint}/buscar`, {
      query,
    });
  }
}
