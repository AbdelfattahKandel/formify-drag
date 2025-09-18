import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TooltipModule } from 'primeng/tooltip';
import { FieldConfig } from '../../../core/models/interfaces/legacy-extras';
import { FieldType } from '../../../core/models/interfaces/type-field';

interface FieldTypeOption {
  label: string;
  value: FieldType;
}

@Component({
  selector: 'app-field-editor-mode',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ChipsModule,
    CheckboxModule,
    InputGroupModule,
    InputGroupAddonModule,
    TooltipModule
  ],
  templateUrl: './field-editor-mode.component.html',
  styleUrls: ['./field-editor-mode.component.css']
})
export class FieldEditorMossdeComponent implements OnChanges {
  fieldTypes: FieldTypeOption[] = [
    { label: 'Text', value: 'input-text' as any },
    { label: 'Password', value: 'password' as any },
    { label: 'Email', value: 'input-text' as any },
    { label: 'Number', value: 'input-number' as any },
    { label: 'Date', value: 'datepicker' as any },
    { label: 'Checkbox', value: 'checkbox' as any },
    { label: 'Radio', value: 'radio' as any },
    { label: 'Select', value: 'select' as any },
    { label: 'Textarea', value: 'textarea' as any },
    { label: 'Color', value: 'colorpicker' as any }
  ];

  private _field: FieldConfig = this.createNewField();

  @Input() set field(value: FieldConfig) {
    this._field = JSON.parse(JSON.stringify(value)); // Deep clone the input
    this.initializeField();
  }

  get field(): FieldConfig {
    return this._field;
  }

  // Getter/setter for columns to handle two-way binding safely (maps to fieldStyle)
  get columns(): number {
    return (this._field as any).fieldStyle?.columns || 1;
  }

  set columns(value: number) {
    if (!(this._field as any).fieldStyle) {
      (this._field as any).fieldStyle = {};
    }
    (this._field as any).fieldStyle.columns = value;
  }

  // Getter/setter for width to handle two-way binding safely (maps to fieldStyle)
  get width(): string {
    const width = (this._field as any).fieldStyle?.width;
    return width ? String(width) : '100%';
  }

  set width(value: string | number | undefined) {
    if (!(this._field as any).fieldStyle) {
      (this._field as any).fieldStyle = {};
    }
    (this._field as any).fieldStyle.width = value ? String(value) : undefined;
  }

  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
  }

  get visible(): boolean {
    return this._visible;
  }

  private _visible = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<FieldConfig>();
  // Live change events so canvas can update reactive FormControl value immediately
  @Output() valueChange = new EventEmitter<{ controlKey: string; value: any }>();
  @Output() cancel = new EventEmitter<void>();

  chipValues: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['field'] && this.field.options) {
      this.chipValues = this.field.options.map((opt: any) =>
        typeof opt === 'string' ? opt : opt.label || opt.value || ''
      ).filter(Boolean);
    }
  }

  private createNewField(): FieldConfig {
    return {
      id: this.generateId(),
      kind: 'control' as any,
      key: '',
      formControl: '',
      type: 'input-text' as any,
      label: '',
      placeholder: '',
      validators: [],
      fieldStyle: {} as any,
      options: []
    };
  }

  private generateId(): string {
    return Math.random().toString(10).substring(2, 5);
  }

  private initializeField() {
    // Ensure the field has all required properties
    const fieldType = (this._field.type as any) || ('input-text' as any);
    const fieldId = this._field.id || this.generateId();
    const fieldKey = this._field.formControl || `field_${fieldType}_${Date.now()}`;
    const kind = (this._field as any).kind || ('control' as any);

    // Create a new field with default values and merge with existing field
    this._field = {
      id: fieldId,
      kind,
      key: (this._field as any).key || String(fieldKey),
      formControl: fieldKey,
      type: fieldType,
      label: this._field.label || 'New Field',
      placeholder: this._field.placeholder || '',
      fieldStyle: {
        columns: typeof (this._field as any).fieldStyle?.columns === 'number' ? (this._field as any).fieldStyle.columns : 1,
        width: (this._field as any).fieldStyle?.width || '100%',
        ...((this._field as any).fieldStyle || {})
      } as any,
      options: (this._field.options || []).map((opt: any) =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
      ),
      validators: this._field.validators || []
    };

    // Initialize chip values for options
    const fieldOptions = Array.isArray(this._field.options) ? this._field.options : [];
    this.chipValues = fieldOptions.map(opt => opt?.label || opt?.value || '').filter(Boolean);
  }

  get isRequired(): boolean {
    return this.field.validators?.some(v => v.name === 'required') || false;
  }

  set isRequired(value: boolean) {
    if (!this._field.validators) {
      this._field.validators = [];
    }

    const hasRequired = this._field.validators.some(v => v.name === 'required');

    if (value && !hasRequired) {
      this._field.validators.push({ name: 'required' } as any);
    } else if (!value && hasRequired) {
      this._field.validators = this._field.validators.filter(v => v.name !== 'required');
    }
  }

  onSave() {
    // Update options from chips if needed
    if (this.chipValues && this.chipValues.length > 0) {
      this._field.options = this.chipValues
        .filter(opt => opt && opt.trim() !== '')
        .map(opt => ({
          label: opt,
          value: opt.toLowerCase().replace(/\s+/g, '_')
        }));
    } else if (this._field.type === 'select' || this._field.type === 'radio' || this._field.type === 'checkbox') {
      this._field.options = [];
    }

    // Ensure we emit fieldStyle (not style) and canonical type values
    const payload: FieldConfig = {
      ...(this._field as any),
      kind: (this._field as any).kind || ('control' as any),
      key: (this._field as any).key || String(this._field.formControl || ''),
      fieldStyle: (this._field as any).fieldStyle,
      type: this._field.type as any
    } as any;

    this.save.emit(payload);
    this.visible = false;
  }

  // Triggered from template when the Value input changes
  onValueChangeInstant(value: any) {
    const key = typeof this._field.formControl === 'string' ? this._field.formControl : '';
    if (key) {
      this.valueChange.emit({ controlKey: key, value });
    }
  }

  onCancel() {
    this.visible = false;
    this.cancel.emit();
  }

  onHide() {
    this.onCancel();
  }

  onChipAdd(event: any) {
    if (event.value) {
      this.chipValues = [...this.chipValues, event.value];
    }
  }

  onChipRemove(event: any) {
    this.chipValues = this.chipValues.filter((_, i) => i !== event.index);
  }

}