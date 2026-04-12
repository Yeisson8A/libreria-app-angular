import { EstadoPrestamo } from '../enums/estado-prestamo.enum';

export interface Prestamo {
  id: number;
  libroId: number;
  tituloLibro: string;
  usuarioId: number;
  nombreUsuario: string;
  fechaPrestamo: string;
  fechaDevolucion?: string;
  estado: EstadoPrestamo;
}