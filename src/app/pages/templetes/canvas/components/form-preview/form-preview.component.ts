import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';
import { RerenderComponent } from '../../../rerender/rerender.component';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RerenderComponent],
  template: `
    <div class="form-preview p-4">
      <h3 class="text-lg font-semibold mb-4">معاينة النموذج</h3>
      <div class="space-y-4">
        @for (field of formFields; track field.id) {
          <div class="p-3 border rounded">
            <app-rerender
              [field]="field"
              [formGroup]="formGroup"
              [isEditMode]="false"
            ></app-rerender>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .form-preview {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background-color: #f8fafc;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormPreviewComponent {
  @Input() formFields: FieldConfig[] = [];
  @Input() formGroup!: FormGroup;
}
