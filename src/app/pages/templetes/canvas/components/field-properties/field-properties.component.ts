import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-field-properties',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule
  ],
  template: `
    <div class="field-properties p-4 border-l border-gray-200 h-full">
      <h3 class="text-lg font-semibold mb-4"> Field Properties </h3>
      
      @if (selectedField) {
        <form [formGroup]="propertiesForm" class="space-y-4">
          <div class="field">
            <label class="block text-sm font-medium mb-1">العنوان</label>
            <input 
              type="text" 
              pInputText 
              formControlName="label" 
              class="w-full"
            >
          </div>
          
          <div class="field">
            <label class="block text-sm font-medium mb-1">الاسم الفني</label>
            <input 
              type="text" 
              pInputText 
              formControlName="formControl" 
              class="w-full"
              [disabled]="true"
            >
          </div>
          
          <div class="field">
            <p-checkbox 
              formControlName="required" 
              [binary]="true"
              label="حقل مطلوب"
            ></p-checkbox>
          </div>
          
          <div class="field" *ngIf="showOptions()">
            <label class="block text-sm font-medium mb-1">الخيارات</label>
            <textarea 
              formControlName="options"
              rows="5"
              placeholder="أدخل الخيارات (سطر لكل خيار)"
              class="w-full p-inputtextarea"
            ></textarea>
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button 
              pButton 
              type="button" 
              label="إلغاء" 
              class="p-button-text"
              (click)="onCancel()"
            ></button>
            <button 
              pButton 
              type="submit" 
              label="حفظ" 
              class="p-button-primary"
              (click)="onSave()"
              [disabled]="!propertiesForm.valid"
            ></button>
          </div>
        </form>
      } @else {
        <div class="text-gray-500 text-center py-8">
          <i class="pi pi-info-circle text-2xl mb-2"></i>
          <p>الرجاء تحديد حقل لتحرير خصائصه</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldPropertiesComponent {
  @Input() set selectedField(field: FieldConfig | null) {
    this._selectedField = field;
    this.updateForm();
  }
  get selectedField(): FieldConfig | null {
    return this._selectedField;
  }
  
  @Output() save = new EventEmitter<FieldConfig>();
  @Output() cancel = new EventEmitter<void>();
  
  propertiesForm: FormGroup;
  private _selectedField: FieldConfig | null = null;

  constructor(private fb: FormBuilder) {
    this.propertiesForm = this.fb.group({
      label: ['', Validators.required],
      formControl: [{value: '', disabled: true}],
      required: [false],
      options: ['']
    });
  }

  private updateForm() {
    if (this._selectedField) {
      this.propertiesForm.patchValue({
        label: this._selectedField.label || '',
        formControl: typeof this._selectedField.formControl === 'string' ? this._selectedField.formControl : '',
        required: this._selectedField.required || false,
        options: Array.isArray((this._selectedField as any).options) ? 
          ((this._selectedField as any).options as {label: string, value: string}[]).map((opt: {label: string}) => opt.label).join('\n') : ''
      });
    } else {
      this.propertiesForm.reset();
    }
  }

  onSave() {
    if (this.propertiesForm.valid && this._selectedField) {
      const formValue = this.propertiesForm.getRawValue();
      const updatedField: FieldConfig = {
        ...this._selectedField,
        ...formValue,
        options: this.parseOptions(formValue.options)
      };
      this.save.emit(updatedField);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  showOptions(): boolean {
    const fieldTypesWithOptions = ['select', 'radio', 'checkbox', 'multi-select'];
    if (!this._selectedField) return false;
    const t = (this._selectedField as any).type as unknown;
    return typeof t === 'string' ? fieldTypesWithOptions.includes(t) : false;
  }

  private parseOptions(optionsText: string): {label: string, value: string}[] {
    if (!optionsText) return [];
    return optionsText
      .split('\n')
      .filter((opt: string) => opt.trim() !== '')
      .map((opt: string) => ({
        label: opt.trim(),
        value: opt.trim().toLowerCase().replace(/\s+/g, '_')
      }));
  }
}
