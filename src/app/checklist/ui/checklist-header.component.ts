import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist, RemoveChecklist } from '../../shared/interfaces/checklist.interface';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-checklist-header',
  template: `
    <header>
      <a routerLink="/home">Back <</a>
      <h1>
        {{ checklist.title }}
      </h1>
      <div>
        <button (click)="addItem.emit()">Add item</button>
        <button (click)="resetChecklist.emit(checklist.id)">Reset</button>
      </div>
    </header>
  `,
  styles: [
    `
      button {
        margin-left: 1rem;
      }
    `,
  ],
})
export class ChecklistHeaderComponent {
  @Input({ required: true }) checklist!: Checklist;

  @Output() addItem = new EventEmitter<void>();
  @Output() resetChecklist = new EventEmitter<RemoveChecklist>();
}
