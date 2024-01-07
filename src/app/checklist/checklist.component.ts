import { Component, computed, effect, inject, signal } from '@angular/core';
import { ChecklistService } from '../shared/data-access/checklist.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ChecklistHeaderComponent } from './ui/checklist-header.component';
import { ChecklistItem } from '../shared/interfaces/checklist-item.interface';
import { ChecklistItemService } from './data-access/checklist-item.service';
import { FormBuilder } from '@angular/forms';
import { ModalComponent } from '../shared/ui/modal.component';
import { FormModalComponent } from '../shared/ui/form-modal.component';
import { ChecklistItemListComponent } from './ui/checklist-item-list.component';

@Component({
  standalone: true,
  imports: [ChecklistHeaderComponent, ModalComponent, FormModalComponent, ChecklistItemListComponent],
  selector: 'app-checklist',
  template: `
    @if (checklist_(); as checklist){
    <app-checklist-header
      [checklist]="checklist"
      (resetChecklist)="checklistItemService.reset$.next($event)"
      (addItem)="checklistItemBeingEdited.set({})"
    />
    }

    <app-checklist-item-list
      [checklistItems]="items_()"
      (toggle)="checklistItemService.toggle$.next($event)"
      (delete)="checklistItemService.remove$.next($event)"
      (edit)="checklistItemBeingEdited.set($event)"
    />

    <app-modal [isOpen]="!!checklistItemBeingEdited()">
      <ng-template>
        <app-form-modal
          title="Create item"
          [formGroup]="checklistItemForm"
          (save)="checklistItemBeingEdited()?.id
                ? checklistItemService.edit$.next({
                    id: checklistItemBeingEdited()!.id!,
                    data: checklistItemForm.getRawValue(),
                    })
                : checklistItemService.add$.next({
                    item: checklistItemForm.getRawValue(),
                    checklistId: checklist_()?.id!,
                    })"
          (close)="checklistItemBeingEdited.set(null)"
        ></app-form-modal>
      </ng-template>
    </app-modal>
  `,
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);

  checklistItemBeingEdited = signal<Partial<ChecklistItem> | null>(null);

  params_ = toSignal(this.route.paramMap);

  checklist_ = computed(() =>
    this.checklistService.checklists_().find((checklist) => checklist.id === this.params_()?.get('id'))
  );

  items_ = computed(() =>
    this.checklistItemService.checklistItems_().filter((item) => item.checklistId === this.params_()?.get('id'))
  );

  checklistItemForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemBeingEdited();

      if (!checklistItem) {
        this.checklistItemForm.reset();
      } else {
        this.checklistItemForm.patchValue({
          title: checklistItem.title,
        });
      }
    });
  }
}
