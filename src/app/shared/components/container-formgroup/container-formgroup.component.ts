import { ChangeDetectionStrategy, Component, input, inject, signal, ChangeDetectorRef, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective, FormGroupName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldConfig } from '../../../core/models/interfaces/legacy-extras';
import { CdkDropList, CdkDragDrop, moveItemInArray, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CreateformbuilderService } from '../../../core/services/formbuilder/createformbuilder.service';
// Child control components (static imports to avoid circular deps)
// No direct control components are used here; children are rendered via RerenderComponent
import { RerenderComponent } from '../../../pages/templetes/rerender/rerender.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-container-formgroup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    RerenderComponent,
    DialogModule,
    InputTextModule,
    ButtonModule,
    // Self import to allow recursive rendering
    forwardRef(() => ContainerFormgroupComponent),
  ],
  templateUrl: './container-formgroup.component.html',
  styleUrls: ['./container-formgroup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Inherit the parent form group context so [formGroupName] works correctly
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class ContainerFormgroupComponent implements OnInit {
  group = input.required<FieldConfig>();
  // propagate edit mode and parent form from renderer
  isEditMode = input<boolean>(false);
  parentForm = input<FormGroup | null>(null);
  private readonly formBuilderService = inject(CreateformbuilderService);
  private _fb = inject(FormBuilder);
  private _cdr = inject(ChangeDetectorRef);
  private _cc = inject(ControlContainer) as FormGroupDirective;

  // Dialog state and form
  showAddDialog = signal(false);
  addGroupForm: FormGroup = this._fb.group({
    groupName: ['', [Validators.required, Validators.minLength(2)]]
  });

  groupKey(): string {
    const g = this.group() as any;
    const byFormControl = typeof g.formControl === 'string' ? g.formControl : '';
    return String(byFormControl || g.key || g.id || '');
  }

  groupLabel(): string | null {
    const g = this.group() as any;
    return (g.label as string) || null;
  }

  // Expose the effective nested FormGroup for children editing
  get effectiveForm(): FormGroup | null {
    const key = this.groupKey();
    const pf = this.parentForm();
    const direct = pf?.get(key) as FormGroup | null;
    return direct || (this._cc.form.get(key) as FormGroup | null);
  }

  ngOnInit(): void {
    // Ensure the nested FormGroup exists on the parent form before formGroupName initializes
    const key = this.groupKey();
    if (!key) return;
    const parentForm = this._cc.form;
    if (parentForm && !parentForm.get(key)) {
      parentForm.addControl(key, new FormGroup({}));
      this._cdr.markForCheck();
    }

    // Ensure default layout for any form group: columns = 4
    const g = this.group() as any;
    if (!g.fieldStyle) g.fieldStyle = {};
    if (g.fieldStyle.columns == null) {
      g.fieldStyle.columns = 4;
      this._cdr.markForCheck();
    }
  }

  children(): FieldConfig[] {
    const g = this.group() as any;
    const list = Array.isArray(g.children)
      ? g.children
      : g.children && typeof g.children === 'object'
        ? Object.values(g.children)
        : [];
    return (list as FieldConfig[]) || [];
  }

  onDrop(event: CdkDragDrop<any>) {
    const parent = this.group() as any;
    const list = this.children();

    // Reorder within the same container
    if (event.previousContainer === event.container) {
      moveItemInArray(list, event.previousIndex, event.currentIndex);
      this.rebuildChildrenMap(parent, list);
      return;
    }

    // From external source (palette/canvas): add a copied field
    const tool = event.item?.data as FieldConfig;
    if (!tool) return;
    const copied = this.formBuilderService.createCopiedField(tool as any);
    this.formBuilderService.addChildToGroup(parent, copied);
  }

  private rebuildChildrenMap(parent: FieldConfig, ordered: FieldConfig[]) {
    // For groups, children stored as Record<string, FieldConfig>
    const map: Record<string, FieldConfig> = {};
    for (const child of ordered) {
      const key = (child as any).key || (child as any).id || `child-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      map[String(key)] = { ...child, key: String(key) } as FieldConfig;
    }
    (parent as any).children = map;
    // trigger change via service update pipeline
    // (service already clones schema on operations; here we directly mutate then mark for check)
    this._cdr.markForCheck();
  }

  // UI actions
  openAddGroupDialog(): void {
    this.addGroupForm.reset({ groupName: '' });
    this.showAddDialog.set(true);
  }

  closeAddGroupDialog(): void {
    this.showAddDialog.set(false);
  }

  confirmAddGroup(): void {
    if (this.addGroupForm.invalid) return;
    const nameRaw = String(this.addGroupForm.value.groupName || '').trim();
    if (!nameRaw) return;
    const keyBase = nameRaw.replace(/\s+/g, '_').toLowerCase();

    // Update current group's label/key to the entered name to reflect immediately
    const parent = this.group() as any;
    parent.label = nameRaw;
    if (!parent.key) parent.key = keyBase;
    // request view update under OnPush
    this._cdr.markForCheck();

    const child: FieldConfig = {
      id: `group-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      kind: 'group',
      key: keyBase,
      label: nameRaw,
      fieldStyle: { columns: 4, width: '100%' } as any,
      children: {}
    } as FieldConfig;
    this.formBuilderService.addChildToGroup(this.group(), child);
    this.closeAddGroupDialog();
  }

  // Quick add controls inside this group (like array items)
  addPreset(type: 'input-text' | 'textarea' | 'select' | 'checkbox' | 'imagefield'): void {
    const parent = this.group();
    const labelMap: Record<string, string> = {
      'input-text': 'Text Input',
      'textarea': 'Textarea',
      'select': 'Select',
      'checkbox': 'Checkbox',
      'imagefield': 'Images',
    };
    const base = this.uniqueBaseFor(type);
    const controlName = this.generateUniqueControlName(parent, base);
    const field: FieldConfig = {
      id: `${type}-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      kind: 'control',
      key: controlName,
      formControl: controlName,
      type,
      label: labelMap[type] || type,
      fieldStyle: { width: '100%' } as any,
      options: type === 'select' ? [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ] : []
    } as any;

    const copied = this.formBuilderService.createCopiedField(field as any);
    this.formBuilderService.addChildToGroup(parent, copied);
    this._cdr.markForCheck();
  }

  private uniqueBaseFor(type: string): string {
    switch (type) {
      case 'input-text': return 'text';
      case 'textarea': return 'textarea';
      case 'select': return 'select';
      case 'checkbox': return 'checkbox';
      case 'imagefield': return 'images';
      default: return 'control';
    }
  }

  private generateUniqueControlName(parent: FieldConfig, base: string): string {
    const existing = new Set<string>();
    const arr = this.children();
    for (const ch of arr) {
      const n = (ch as any).formControl || (ch as any).key;
      if (typeof n === 'string' && n) existing.add(n);
    }
    let idx = 1;
    let name = base;
    while (existing.has(name)) {
      name = `${base}_${idx++}`;
    }
    return name;
  }
}
