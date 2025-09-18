import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';
import { RerenderComponent } from '../../../rerender/rerender.component';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CdkDropList, CdkDrag, RerenderComponent],
  template: `
    <div class="form-builder p-4">
      <div 
        cdkDropList
        (cdkDropListDropped)="onDrop($event)"
        class="space-y-4"
      >
        @for (field of formFields; track trackByFn($index, field)) {
          <div 
            cdkDrag
            [cdkDragData]="field"
            class="p-3 border rounded cursor-move"
            (click)="onFieldSelect(field)"
          >
            <app-rerender
              [field]="field"
              [formGroup]="formGroup"
              (editRequested)="onEditField(field)"
            ></app-rerender>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .form-builder {
      min-height: 400px;
      border: 2px dashed #ccc;
      border-radius: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormBuilderComponent {
  @Input() formFields: FieldConfig[] = [];
  @Input() formGroup!: FormGroup;
  
  @Output() fieldDropped = new EventEmitter<CdkDragDrop<FieldConfig[]>>();
  @Output() fieldSelected = new EventEmitter<FieldConfig>();
  @Output() editField = new EventEmitter<FieldConfig>();

  onDrop(event: CdkDragDrop<FieldConfig[]>) {
    this.fieldDropped.emit(event);
  }

  onFieldSelect(field: FieldConfig) {
    this.fieldSelected.emit(field);
  }

  onEditField(field: FieldConfig) {
    this.editField.emit(field);
  }

  trackByFn(index: number, item: FieldConfig) {
    return item.id || index;
  }
}
