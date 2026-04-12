import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Usuario } from '../models/usuario.model';
import { CrearUsuarioRequest } from '../models/crear-usuario-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private api = inject(ApiService);
  private endpoint = 'usuarios';

  // Listar usuarios
  listar(): Observable<Usuario[]> {
    return this.api.get<Usuario[]>(this.endpoint);
  }

  // Obtener usuario por ID
  obtener(id: number): Observable<Usuario> {
    return this.api.get<Usuario>(`${this.endpoint}/${id}`);
  }

  // Crear usuario
  crear(data: CrearUsuarioRequest): Observable<Usuario> {
    return this.api.post<Usuario>(this.endpoint, data);
  }
}