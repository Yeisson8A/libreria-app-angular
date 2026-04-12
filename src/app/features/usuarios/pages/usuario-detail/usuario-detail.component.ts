import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-usuario-detail',
  standalone: true,
  imports: [],
  templateUrl: './usuario-detail.component.html',
  styleUrl: './usuario-detail.component.scss'
})
export class UsuarioDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(UsuarioService);

  usuario?: Usuario;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.obtener(id).subscribe(data => this.usuario = data);
  }
}
