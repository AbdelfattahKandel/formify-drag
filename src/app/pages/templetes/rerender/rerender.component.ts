import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from '../../../core/models/interfaces/legacy-extras';
import { CreateformbuilderService } from '../../../core/services/formbuilder/createformbuilder.service';

// PrimeNG Control Components
import { CheckboxComponent } from '../../../shared/components/controls/primeng-controls/checkbox/checkbox.component';
import { ColorpickerComponent } from '../../../shared/components/controls/primeng-controls/colorpicker/colorpicker.component';
import { DatepickerComponent } from '../../../shared/components/controls/primeng-controls/datepicker/datepicker.component';
import { InputnumberComponent } from '../../../shared/components/controls/primeng-controls/inputnumber/inputnumber.component';
import { InputtextComponent } from '../../../shared/components/controls/primeng-controls/inputtext/inputtext.component';
import { MultiselectComponent } from '../../../shared/components/controls/primeng-controls/multiselect/multiselect.component';
import { PasswordComponent } from '../../../shared/components/controls/primeng-controls/password/password.component';
import { RadiobuttonComponent } from '../../../shared/components/controls/primeng-controls/radiobutton/radiobutton.component';
import { SelectComponent } from '../../../shared/components/controls/primeng-controls/select/select.component';
import { SelectbuttonComponent } from '../../../shared/components/controls/primeng-controls/selectbutton/selectbutton.component';
import { TextareaComponent } from '../../../shared/components/controls/primeng-controls/textarea/textarea.component';
import { TogglebuttonComponent } from '../../../shared/components/controls/primeng-controls/togglebutton/togglebutton.component';
import { ToggleswitchComponent } from '../../../shared/components/controls/primeng-controls/toggleswitch/toggleswitch.component';
import { ContainerFormgroupComponent } from '../../../shared/components/container-formgroup/container-formgroup.component';
import { ContainerFormarrayComponent } from '../../../shared/components/container-formarray/container-formarray.component';
import { ImagefieldComponent } from "../../../shared/components/controls/primeng-controls/imagefield/imagefield.component";




// import { FileFieldComponent } from '../../controls/primeng/file-field/file-field.component';
// import { ImageFieldComponent } from '../../controls/primeng/image-field/image-field.component';


@Component({
  selector: 'app-rerender',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // PrimeNG Control Components
    CheckboxComponent,
    ColorpickerComponent,
    DatepickerComponent,
    InputnumberComponent,
    InputtextComponent,
    MultiselectComponent,
    PasswordComponent,
    RadiobuttonComponent,
    SelectComponent,
    SelectbuttonComponent,
    TextareaComponent,
    TogglebuttonComponent,
    ToggleswitchComponent,
    // Container containers (wrapped to avoid circular import eval order)
    forwardRef(() => ContainerFormgroupComponent),
    forwardRef(() => ContainerFormarrayComponent),
    ImagefieldComponent
  ],
  templateUrl: './rerender.component.html',
  styleUrl: './rerender.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RerenderComponent {
  @Input() field!: FieldConfig;
  @Input() parent: FieldConfig | null = null;
  @Input() isEditMode = false;
  @Input() isRowSelected = false;
  @Input() formGroup: FormGroup = new FormGroup({});
  @Output() editRequested = new EventEmitter<void>();

  showEditModal = false;
  isDragging = false;
  mouseDownTimeout: any;
  mouseDownPosition = { x: 0, y: 0 };

  // Stable bins for nested drop lists (CDK mutates these arrays internally)
  groupDropBin: any[] = [];
  arrayDropBin: any[] = [];

  // Allow all drags to enter nested drop lists (match CDK signature)
  alwaysTrue = (_drag?: any, _drop?: any) => true;

  constructor(private _fbService: CreateformbuilderService) {}

  ngOnInit(): void {
    this.initializeField();
  }

  // Provide a safe accessor for the image FormArray to use in template
  getFormArray(_f: FieldConfig): FormArray | null {
    if (!_f?.formControl) return null;
    const key = _f.formControl as unknown;
    if (typeof key !== 'string') return null;
    const ctrl = this.formGroup.get(key);
    return (ctrl instanceof FormArray) ? ctrl : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field'] || changes['formGroup']) {
      this.initializeField();
    }
  }

  initializeField(): void {
    if (!this.field) return;

    const isGroup = (this.field as any).kind === 'group';
    // For groups, prefer formControl if provided; fallback to key or id
    const groupKey = isGroup
      ? (typeof (this.field as any).formControl === 'string'
          ? (this.field as any).formControl as string
          : String((this.field as any).key || (this.field as any).id || ''))
      : null;
    // For normal controls, use formControl name
    const controlKey = !isGroup ? (typeof this.field.formControl === 'string' ? this.field.formControl as string : '') : '';

    // Decide the name we will use in the parent FormGroup
    const name = isGroup ? groupKey : controlKey;
    if (!name) return;

    const existing = this.formGroup.get(name);

    if (isGroup) {
      if (!existing) {
        this.formGroup.addControl(name, new FormGroup({}));
      }
      return;
    }

    if (this.getType() === 'imagefield') {
      // Ensure a FormArray exists for image inputs
      if (!existing) {
        this.formGroup.addControl(name, new FormArray([]));
      }
      // Normalize FieldConfig.value to an array
      if (!Array.isArray(this.field.value)) {
        this.field.value = this.field.value ? [this.field.value as any] : [];
      }
      return;
    }

    const control = existing as FormControl | null;
    if (!control) {
      // If control doesn't exist, create it with disabled state if needed
      const newControl = new FormControl({
        value: this.field.value || null,
        disabled: this.field.disabled || false
      });
      this.formGroup.addControl(name, newControl);
    } else if (this.field.disabled !== undefined) {
      // Update disabled state if changed
      if (this.field.disabled) {
        control.disable();
      } else {
        control.enable();
      }
    }
  }

  onFieldClick(event: MouseEvent): void {
    // Don't do anything in edit mode, we'll use the edit button only
    if (this.isEditMode) {
      return;
    }
    
    // Only handle the click if we're not dragging
    if (!this.isDragging) {
      event.stopPropagation();
      // Don't emit edit event here, we'll use the edit button only
    }
  }

  onEditClick(event: MouseEvent): void {
    event.stopPropagation();
    this.editRequested.emit();
  }

  onMouseDown(event: MouseEvent): void {
    // Only handle left mouse button
    if (event.button !== 0) {
      return;
    }
    
    // Store the mouse down position
    this.mouseDownPosition = {
      x: event.clientX,
      y: event.clientY
    };
    
    // Set a timeout to detect if this is a drag or click
    this.mouseDownTimeout = setTimeout(() => {
      this.isDragging = true;
    }, 50); // 50ms threshold for drag detection
  }

  onMouseUp(): void {
    // Clear the timeout on mouse up
    clearTimeout(this.mouseDownTimeout);
    
    // Reset dragging state after a short delay
    setTimeout(() => {
      this.isDragging = false;
    }, 0);
  }
  
  onMouseLeave(): void {
    // If mouse leaves the element while dragging, cancel any pending click
    if (this.mouseDownTimeout) {
      clearTimeout(this.mouseDownTimeout);
      this.mouseDownTimeout = null;
      this.isDragging = true;
    }
  }
  
  getColumnClass(): string {
    const cols = (this.field as any).fieldStyle?.columns || 12;
    return `col-${cols}`;
  }

  width(): string | null {
    const w = (this.field as any).fieldStyle?.width;
    return w ? String(w) : null;
  }

  getType(): string {
    const f: any = this.field as any;
    const t = f?.type ?? '';
    const k = f?.kind ?? '';
    return String(t || k || '');
  }

  getSelectedOptionLabel(field: FieldConfig): string {
    if (!field.value && field.value !== 0 && field.value !== false) {
      return '';
    }
    
    const selectedOption = field.options?.find((opt: any) => {
      // Handle both object and primitive value comparisons
      if (typeof opt === 'object' && opt !== null) {
        return opt.value === field.value || 
               String(opt.value) === String(field.value);
      }
      return opt === field.value || 
             String(opt) === String(field.value);
    });

    if (selectedOption) {
      return typeof selectedOption === 'object' ? selectedOption.label : String(selectedOption);
    }
    
    return String(field.value);
  }

  // Helpers for template typing
  asField(value: any): FieldConfig {
    return value as FieldConfig;
  }

  arrayChildren(children: any): FieldConfig[] {
    return Array.isArray(children) ? (children as FieldConfig[]) : [];
  }

  // Handle nested drop inside group/array containers
  onChildDrop(event: CdkDragDrop<any>, parent: FieldConfig) {
    const tool = event.item?.data as FieldConfig;
    if (!tool || !parent?.kind) return;
    const child = this._fbService.createCopiedField(tool);
    if (parent.kind === 'group') {
      this._fbService.addChildToGroup(parent, child);
    } else if (parent.kind === 'array') {
      this._fbService.addItemToArray(parent, child);
    }
  }

  // Add a subgroup inside a group container
  addSubGroup(parent: FieldConfig) {
    if (parent.kind !== 'group') return;
    const name = prompt('Enter inner group name');
    if (!name || !name.trim()) return;
    const keyBase = name.trim().replace(/\s+/g, '_').toLowerCase();
    const child: FieldConfig = {
      id: `group-${Date.now()}`,
      kind: 'group',
      key: keyBase,
      label: name.trim(),
      children: {}
    };
    this._fbService.addChildToGroup(parent, child);
  }

}
