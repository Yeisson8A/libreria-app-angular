import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './card-grid.component.html',
  styleUrl: './card-grid.component.scss',
})
export class CardGridComponent<T> {
  @Input() items: T[] = [];

  @Input() titleKey!: keyof T;
  @Input() subtitleKey!: keyof T;
  @Input() extraKey?: keyof T;
  @Input() state?: keyof T;
  @Input() showEdit = true;
  @Input() showDelete = true;
  @Input() customActions?: (item: any) => any[];

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
}
