import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal, ChangeDetectorRef, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDrag, CdkDragHandle, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { RerenderComponent } from '../../../pages/templetes/rerender/rerender.component';
import { FieldEditorMossdeComponent } from '../../components/field-editor-mode/field-editor-mode.component';
import { FieldConfig } from '../../../core/models/interfaces/legacy-extras';
import { CreateformbuilderService } from '../../../core/services/formbuilder/createformbuilder.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { QUICK_ADD_ARRAY_TOOLS, QuickAddTool, QuickAddType } from '../../../pages/templetes/canvas/config/quick-add-tools';
import { FormGroupFactoryService } from '../../../core/services/formbuilder/form-group-factory.service';
// import { v4 as uuidv4 } from 'uuid';

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
    FieldEditorMossdeComponent,
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
  @Input() arrayEditMode!: boolean;
  @Output() arrayEditModeChange = new EventEmitter<boolean>();
    parentForm = input<FormGroup | null>(null);
  @Output() editRequested = new EventEmitter<FieldConfig>();
  private readonly _service = inject(CreateformbuilderService);
  private readonly _fb = inject(FormBuilder);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _fgFactory = inject(FormGroupFactoryService);

  // Local state
  showAddDialog = signal(false);
  addItemForm: FormGroup = this._fb.group({
    label: ['', [Validators.required, Validators.minLength(2)]],
    type: ['input-text', [Validators.required]],
  });

  // Field edit dialog (per selected field) - use FieldEditorMossdeComponent
  showFieldEditDialog = signal(false);
  selectedTemplateField: FieldConfig | null = null;

  // Quick-add config (externalized)
  readonly QUICK_ADD_ARRAY_TOOLS = QUICK_ADD_ARRAY_TOOLS;

  ngOnInit(): void {
    // Ensure FormArray exists on parent form
    let key = this.arrayKey();
    const parent = (this.parentForm() as FormGroup) || (this._cc.form as FormGroup);
    if (!key) {
      // Generate a safe key if schema lacks one and store it on the array config
      key = this.generateUniqueControlName('items');
      (this.array() as any).formControl = key;
    }
    const existing = parent.get(key);
    if (!existing) {
      parent.addControl(key, new FormArray<FormGroup<any>>([]));
    }

    // Fallback for parentForm if not provided by parent
    if (!this.parentForm()) {
      (this as any).parentForm.set(this._cc.form as FormGroup);
    }
  }

  // Forward edit from nested renderer
  onChildEdit(field: FieldConfig) {
    // Open local edit dialog for this field inside array
    if (!field) return;
    this.openEditDialog(field);
  }

  // Toolbar click handler to avoid casts in template
  onToolClick(tool: QuickAddTool): void {
    if (tool.openDialog) {
      this.openAddArrayDialog();
    } else {
      this.addPreset(tool.type as any);
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
    return String(byFormControl || a.key || '');
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

  // Runtime FormArray accessor
  get formArray(): FormArray<FormGroup<any>> | null {
    const key = this.arrayKey();
    if (!key) return null;
    const ctrl = this.effectiveForm.get(key);
    return ctrl instanceof FormArray ? (ctrl as FormArray<FormGroup<any>>) : null;
  }

  // For template typing: return only FormGroup controls
  formArrayGroups(): FormGroup[] {
    const fa = this.formArray;
    if (!fa) return [];
    return fa.controls.filter((c: any) => c instanceof FormGroup) as FormGroup[];
  }

  addItem(): void {
    let key = this.arrayKey();
    console.log('[ContainerFormarray] addItem() key=', key);
    let fa = this.formArray;
    console.log('[ContainerFormarray] existing FormArray?', !!fa, 'length=', fa?.length);
    if (!fa) {
      const parent = this.effectiveForm;
      if (!key) {
        key = this.generateUniqueControlName('items');
        (this.array() as any).formControl = key;
      }
      const existing = parent.get(key);
      if (existing instanceof FormArray) {
        fa = existing as FormArray<FormGroup<any>>;
      } else {
        fa = new FormArray<FormGroup<any>>([]);
        parent.addControl(key, fa);
      }
      console.log('[ContainerFormarray] created FormArray, length=', fa.length);
    }
    if (!fa) return;
    const template = this.items();
    const itemGroup = this._fgFactory.build({fields : template});
    const before = fa.length;
    fa.push(itemGroup);
    console.log('[ContainerFormarray] pushed itemGroup. before=', before, 'after=', fa.length);
    this._cdr.markForCheck();
  }

  removeItem(index: number): void {
    const fa = this.formArray;
    if (!fa) return;
    if (index < 0 || index >= fa.length) return;
    fa.removeAt(index);
    this._cdr.markForCheck();
  }

  // (Search dialog removed): open editor directly from item actions

  openEditDialog(field: FieldConfig): void {
    this.selectedTemplateField = field;
    this.showFieldEditDialog.set(true);
  }

  closeEditDialog(): void {
    this.showFieldEditDialog.set(false);
    this.selectedTemplateField = null;
  }

  onArrayFieldSaved(updatedField: FieldConfig): void {
    if (!this.selectedTemplateField) return;
    // Merge back into template children
    const list = this.items();
    const prevName = String(((this.selectedTemplateField as any).formControl || (this.selectedTemplateField as any).key || ''));
    const idx = list.findIndex((f) => {
      const name = String(((f as any).formControl || (f as any).key || ''));
      return name === prevName;
    });
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        ...updatedField,
        fieldStyle: { ...(list[idx] as any).fieldStyle, ...(updatedField as any).fieldStyle } as any,
      } as any;
      // Replace children to trigger CD
      (this.array() as any).children = [...list];
      this.selectedTemplateField = list[idx];
      this._cdr.markForCheck();
    }
    this.closeEditDialog();
    // Exit edit mode so runtime Add Item is available
    this.arrayEditModeChange.emit(false);
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
          // id: uuidv4(),
          kind: 'array',
          key: controlName,
          formControl: nameRaw, // keep raw entered name to appear in JSON
          type,
          label: nameRaw,
          fieldStyle: { columns: 4, width: '100%' } as any,
          children: []
        }
      : {
          // id: uuidv4(),
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

  addPreset(type: 'input-text' | 'textarea' | 'select' | 'checkbox' | 'imagefield' | 'array'| 'multi-select' ): void {
    const base = this.uniqueBaseFor(type);
    const name = this.generateUniqueControlName(base);
    const isArray = type === 'array';
    const field: FieldConfig = (isArray
      ? {
          // id: uuidv4(),
          kind: 'array',
          key: name,
          formControl: name,
          type,
          label: this.labelFor(type),
          fieldStyle: { columns: 4, width: '100%' } as any,
          children: []
        }
      : {
          // id: uuidv4(),
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
      case 'mullti-select': return 'multiselect'

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
      case 'mullti-select': return 'multiselect'
      default: return type;
    }
  }
  // toggleEditMode() {
  //   this.arrayEditMode = !this.arrayEditMode;
  // }
}
