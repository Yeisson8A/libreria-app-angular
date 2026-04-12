import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../../../../core/models/usuario.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  usuarios: Usuario[] = [];

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe(data => {
      this.usuarios = data;
    });
  }

  irCrear() {
    this.router.navigate(['/usuarios/nuevo']);
  }
}
