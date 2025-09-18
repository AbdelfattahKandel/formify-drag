import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal, ChangeDetectorRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDrag, CdkDragHandle, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { RerenderComponent } from '../../../pages/templetes/rerender/rerender.component';
import { FieldConfig } from '../../../core/models/interfaces/legacy-extras';
import { CreateformbuilderService } from '../../../core/services/formbuilder/createformbuilder.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { QUICK_ADD_ARRAY_TOOLS, QuickAddTool, QuickAddType } from '../../../pages/templetes/canvas/config/quick-add-tools';

@Component({
  selector: 'app-container-formarray',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    // Wrap RerenderComponent to break cyclic import with Rerender importing this container
    forwardRef(() => RerenderComponent),
    DialogModule,
    InputTextModule,
    ButtonModule,
    // Self import to allow recursive rendering if needed and mirror group behavior
    // forwardRef(() => ContainerFormarrayComponent),
  ],
  templateUrl: './container-formarray.component.html',
  styleUrls: ['./container-formarray.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class ContainerFormarrayComponent implements OnInit {
  // form context first so it's available to other inputs
  private readonly _cc = inject(ControlContainer) as FormGroupDirective;
  array = input.required<FieldConfig>();
  // edit mode and parent form inputs to mirror root editing behavior
  isEditMode = input<boolean>(false);
  parentForm = input<FormGroup | null>(null);
  private readonly _service = inject(CreateformbuilderService);
  private readonly _fb = inject(FormBuilder);
  private readonly _cdr = inject(ChangeDetectorRef);

  // Local state
  showAddDialog = signal(false);
  addItemForm: FormGroup = this._fb.group({
    label: ['', [Validators.required, Validators.minLength(2)]],
    type: ['input-text', [Validators.required]],
  });

  // Quick-add config (externalized)
  readonly QUICK_ADD_ARRAY_TOOLS = QUICK_ADD_ARRAY_TOOLS;

  ngOnInit(): void {
    // Ensure FormArray exists on parent form
    const key = this.arrayKey();
    if (key) {
      const parent = this._cc.form;
      const existing = parent.get(key);
      if (!existing) {
        parent.addControl(key, new FormArray([]));
      }
    }

    // Fallback for parentForm if not provided by parent
    if (!this.parentForm()) {
      (this as any).parentForm.set(this._cc.form as FormGroup);
    }
  }

  // Toolbar click handler to avoid casts in template
  onToolClick(tool: QuickAddTool): void {
    if (tool.openDialog) {
      this.openAddArrayDialog();
    } else {
      this.addPreset(tool.type as QuickAddType);
    }
  }

  // Default layout
  ngAfterViewInit(): void {
    const a = this.array() as any;
    if (!a.fieldStyle) a.fieldStyle = {};
    if (a.fieldStyle.columns == null) a.fieldStyle.columns = 4;
  }

  // Keys and labels
  arrayKey(): string {
    const a = this.array() as any;
    const byFormControl = typeof a.formControl === 'string' ? a.formControl : '';
    return String(byFormControl || a.key || a.id || '');
  }
  arrayLabel(): string | null {
    const a = this.array() as any;
    return (a.label as string) || null;
  }

  // Children accessor as array
  items(): FieldConfig[] {
    const a = this.array() as any;
    const list = Array.isArray(a.children) ? a.children : [];
    return (list as FieldConfig[]) || [];
  }

  // Provide a non-null FormGroup for template binding
  get effectiveForm(): FormGroup {
    return (this.parentForm() as FormGroup) || (this._cc.form as FormGroup);
  }

  // Drag and drop
  onDrop(event: CdkDragDrop<any>) {
    const parent = this.array();
    const list = this.items();
    if (event.previousContainer === event.container) {
      moveItemInArray(list, event.previousIndex, event.currentIndex);
      (parent as any).children = [...list];
      this._cdr.markForCheck();
      return;
    }
    const tool = event.item?.data as FieldConfig;
    if (!tool) return;
    const copied = this._service.createCopiedField(tool as any);
    this._service.addItemToArray(parent, copied);
  }

  // Toolbar actions
  openAddDialog(): void {
    this.addItemForm.reset({ label: '', type: 'input-text' });
    this.showAddDialog.set(true);
  }
  // Open dialog preset to Array type so user can type array name
  openAddArrayDialog(): void {
    this.addItemForm.reset({ label: '', type: 'array' });
    this.showAddDialog.set(true);
  }
  closeAddDialog(): void {
    this.showAddDialog.set(false);
  }
  confirmAdd(): void {
    if (this.addItemForm.invalid) return;
    const nameRaw = String(this.addItemForm.value.label || '').trim();
    const type = String(this.addItemForm.value.type || 'input-text');
    if (!nameRaw) return;
    // For arrays: preserve the exact entered label as the formArrayName in JSON (even if non-Latin)
    // We'll still generate a safe key for internal uniqueness, but formControl keeps the raw label.
    const base = type === 'array' ? (this.sanitizeName(nameRaw) || 'items') : this.uniqueBaseFor(type);
    const controlName = this.generateUniqueControlName(base);
    const isArray = type === 'array';
    const field: FieldConfig = (isArray
      ? {
          id: `${type}-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          kind: 'array',
          key: controlName,
          formControl: nameRaw, // keep raw entered name to appear in JSON
          type,
          label: nameRaw,
          fieldStyle: { columns: 4, width: '100%' } as any,
          children: []
        }
      : {
          id: `${type}-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          kind: 'control',
          key: controlName,
          formControl: controlName,
          type,
          label: nameRaw,
          fieldStyle: { columns: 2, width: '100%' } as any,
          options: type === 'select' ? [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
          ] : []
        }
    ) as any;
    const copied = this._service.createCopiedField(field as any);
    this._service.addItemToArray(this.array(), copied);
    this.closeAddDialog();
    this._cdr.markForCheck();
  }

  addPreset(type: 'input-text' | 'textarea' | 'select' | 'checkbox' | 'imagefield' | 'array'): void {
    const base = this.uniqueBaseFor(type);
    const name = this.generateUniqueControlName(base);
    const isArray = type === 'array';
    const field: FieldConfig = (isArray
      ? {
          id: `${type}-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          kind: 'array',
          key: name,
          formControl: name,
          type,
          label: this.labelFor(type),
          fieldStyle: { columns: 4, width: '100%' } as any,
          children: []
        }
      : {
          id: `${type}-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          kind: 'control',
          key: name,
          formControl: name,
          type,
          label: this.labelFor(type),
          fieldStyle: { columns: 2, width: '100%' } as any,
          options: type === 'select' ? [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
          ] : []
        }
    ) as any;
    const copied = this._service.createCopiedField(field as any);
    this._service.addItemToArray(this.array(), copied);
    this._cdr.markForCheck();
  }

  private generateUniqueControlName(base: string): string {
    const existing = new Set<string>();
    for (const ch of this.items()) {
      const n = (ch as any).formControl || (ch as any).key;
      if (typeof n === 'string' && n) existing.add(n);
    }
    let idx = 1;
    let name = base;
    while (existing.has(name)) name = `${name}_${idx++}`;
    return name;
  }
  private sanitizeName(str: string): string {
    return String(str)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');
  }
  private uniqueBaseFor(type: string): string {
    switch (type) {
      case 'input-text': return 'text';
      case 'textarea': return 'textarea';
      case 'select': return 'select';
      case 'checkbox': return 'checkbox';
      case 'imagefield': return 'images';
      case 'array': return 'items';
      default: return 'control';
    }
  }
  private labelFor(type: string): string {
    switch (type) {
      case 'input-text': return 'Text Input';
      case 'textarea': return 'Textarea';
      case 'select': return 'Select';
      case 'checkbox': return 'Checkbox';
      case 'imagefield': return 'Images';
      case 'array': return 'Array';
      default: return type;
    }
  }
}
