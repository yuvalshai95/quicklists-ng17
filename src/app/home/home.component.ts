import { Component, effect, inject, signal } from '@angular/core';
import { ModalComponent } from '../shared/ui/modal.component';
import { Checklist } from '../shared/interfaces/checklist.interface';
import { FormBuilder } from '@angular/forms';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { ChecklistListComponent } from './ui/checklist-list.component';

@Component({
  standalone: true,
  imports: [ModalComponent, FormModalComponent, ChecklistListComponent],
  selector: 'app-home',
  template: `
    <header>
      <h1>Quicklists</h1>
      <button (click)="checklistBeingEdited_.set({})">Add Checklist</button>
    </header>

    <section>
      <h2>Your Checklists</h2>
      <app-checklist-list
        [checklists]="checklistService.checklists_()"
        (delete)="checklistService.remove$.next($event)"
        (edit)="checklistBeingEdited_.set($event)"
      />
    </section>

    <app-modal [isOpen]="!!checklistBeingEdited_()">
      <ng-template>
        <app-form-modal
          [title]="checklistBeingEdited_()?.title ? checklistBeingEdited_()!.title! : 'Add Checklist'"
          [formGroup]="checklistForm"
          (close)="checklistBeingEdited_.set(null)"
          (save)="
            checklistBeingEdited_()?.id
              ? checklistService.edit$.next({
                  id: checklistBeingEdited_()!.id!,
                  data: checklistForm.getRawValue()
                })
              : checklistService.add$.next(checklistForm.getRawValue())
          "
        />
      </ng-template>
    </app-modal>
  `,
  styles: [
    `
      ul {
        padding: 0;
        margin: 0;
      }
      li {
        font-size: 1.5em;
        display: flex;
        justify-content: space-between;
        background: var(--color-light);
        list-style-type: none;
        margin-bottom: 1rem;
        padding: 1rem;

        button {
          margin-left: 1rem;
        }
      }
    `,
  ],
})
export default class HomeComponent {
  private readonly formBuilder = inject(FormBuilder);
  public readonly checklistService = inject(ChecklistService);

  checklistBeingEdited_ = signal<Partial<Checklist> | null>(null);

  checklistForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    // Clear form text after save or close
    effect(() => {
      const checklist = this.checklistBeingEdited_();

      if (!checklist) {
        this.checklistForm.reset();
      } else {
        this.checklistForm.patchValue({
          title: checklist.title,
        });
      }
    });
  }
}
