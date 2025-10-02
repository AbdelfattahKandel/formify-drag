import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal, effect, Injector, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';

// Components
import { PaletteComponent } from '../palette/palette.component';
import { RerenderComponent } from '../rerender/rerender.component';
import { JsonViewerComponent } from '../../../shared/components/json-viewer/json-viewer.component';
import { TogglebuttonComponent } from '../../../shared/components/controls/primeng-controls/togglebutton/togglebutton.component';
import { ToggleswitchComponent } from '../../../shared/components/controls/primeng-controls/toggleswitch/toggleswitch.component';
import { FieldEditorMossdeComponent } from '../../../shared/components/field-editor-mode/field-editor-mode.component';

// Models
import { FieldConfig } from '../../../core/models/interfaces/legacy-extras';
import { FormSchema } from '../../../core/models/interfaces/form-schema';

// PrimeNG Modules
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';

// Local Components
import { FormToolbarComponent } from './components/form-toolbar/form-toolbar.component';
import { FormBuilderComponent as FormBuilderContainer } from './components/form-builder/form-builder.component';
import { FormPreviewComponent } from './components/form-preview/form-preview.component';
import { FieldPropertiesComponent } from './components/field-properties/field-properties.component';
import { CreateformbuilderService } from '../../../core/services/formbuilder/createformbuilder.service';
import { FormGroupFactoryService } from '../../../core/services/formbuilder/form-group-factory.service';
import { exportSchema } from '../../../utils/export-schema';
import { PALETTE_TOOLS } from './config/palette-tools';

type TabValue = 'primeng' | 'default';
interface TabOption {
  label: string;
  value: TabValue;
  icon?: string;
}

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // CDK Modules
    CdkDropList,
    CdkDrag,
    // PrimeNG Modules
    DialogModule,
    ButtonModule,
    ToolbarModule,
    PanelModule,
    TabViewModule,
    TooltipModule,
    SelectButtonModule,
    FieldEditorMossdeComponent,
    // Local Components
    PaletteComponent,
    RerenderComponent,
    InputTextModule
  ],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MessageService, 
    DialogService
  ]
})
export class CanvasComponent implements OnInit, OnDestroy {
  private _fb = inject(FormBuilder);
  darkIcon: string = 'pi pi-moon';
  readonly tabs: TabOption[] = [
    { label: 'PrimeNG', value: 'primeng', icon: 'pi pi-prime' },
    { label: 'Default', value: 'default', icon: 'pi pi-list' },
  ];

  selectionCtrl = this._fb.control<TabValue>('primeng');
  // Services
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly dialogService = inject(DialogService);
  private readonly formBuilderService = inject(CreateformbuilderService);
  private readonly fgFactory = inject(FormGroupFactoryService);
  private readonly subs = new Subscription();
  private readonly injector = inject(Injector);

  // Form
  formGroup = this.fb.group({});
  @ViewChild('importJsonInput') importJsonInput!: ElementRef<HTMLInputElement>;
  
  // State
  isPreviewMode = signal(false);
  selectedField: FieldConfig | null = null;
  title: string = '';
  
  // Toolbox items (externalized)
  paletteTools: FieldConfig[] = PALETTE_TOOLS;

  // Fields
  fields = signal<FieldConfig[]>([]);
  // Keep form controls in sync with fields using a Signal effect bound to component injector
  private readonly fieldsEffect = effect(() => {
    const current = this.fields();
    this.updateFormControls(current);
  }, { injector: this.injector });
  
  // Track by function for ngFor
  trackByFn = (index: number, item: FieldConfig) => item.formControl || index;

  ngOnInit(): void {
    // Initialize form group
    this.initializeForm();
    
    // Subscribe to form value changes
    this.subs.add(
      this.formGroup.valueChanges.subscribe((rawValues: any) => {
        const values = rawValues as Record<string, any>;
        // Update field values in the store
        this.fields.update(fields => {
          return fields.map(field => {
            const fc = field.formControl;
            if (typeof fc === 'string' && values[fc] !== undefined) {
              return { ...field, value: values[fc] } as FieldConfig;
            }
            return field;
          });
        });
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private initializeForm(): void {
    // Initialize the main form group
    this.formGroup = this.fb.group({});
  }

  private updateFormControls(fields: FieldConfig[]): void {
    // Build form group from core factory based on current flat fields
    const schema: FormSchema = { id: 'temp', fields } as unknown as FormSchema;
    this.formGroup = this.formBuilderService.buildFormGroup(schema);
  }
  
  private getFieldValidators(field: FieldConfig) {
    const validators = [] as any[];
    
    if (field.required) {
      validators.push(Validators.required);
    }
    
    if ((field as any).min !== undefined) {
      validators.push(Validators.min((field as any).min));
    }
    
    if ((field as any).max !== undefined) {
      validators.push(Validators.max((field as any).max));
    }
    
    if ((field as any).minLength !== undefined) {
      validators.push(Validators.minLength((field as any).minLength));
    }
    
    if ((field as any).maxLength !== undefined) {
      validators.push(Validators.maxLength((field as any).maxLength));
    }
    
    if ((field as any).pattern) {
      validators.push(Validators.pattern((field as any).pattern));
    }
    
    if ((field as any).type === 'email') {
      validators.push(Validators.email);
    }
    
    return validators.length > 0 ? validators : null;
  }
  isEditMode: boolean = true;
  droppedTools: FieldConfig[] = [];


  private updateFormWithDroppedTools() {
    this.syncFormWithDroppedTools();
  }
  showFieldEditor = false;
  showJsonDialog = false;
  generatedJson = '';
  // Add-control dialog state
  showAddControlDialog = false;
  targetGroup: FieldConfig | null = null;
  newControl: Partial<FieldConfig> = { type: 'text' as any, label: '', formControl: '' } as any;
  controlTypes: string[] = ['text','password','email','number','date','time','datetime-local','checkbox','radio','select','multi-select','textarea','file','color'];

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const originalItem = event.previousContainer.data[event.previousIndex];
      const copiedItem: FieldConfig = this.formBuilderService.createCopiedField(originalItem as any);
      
      this.droppedTools.splice(event.currentIndex, 0, copiedItem);
      this.droppedTools = [...this.droppedTools];
      // Ensure FormGroup has controls for new fields
      this.updateFormWithDroppedTools();
      
      this.onFieldSelected(copiedItem);
      
      // this.openFieldEditor(copiedItem);
    }
  }
  openAddControlDialog(group: FieldConfig) {
    this.targetGroup = group;
    this.newControl = { type: 'text', label: '', formControl: '' } as any;
    this.showAddControlDialog = true;
  }

  addControlToTargetGroup() {
    if (!this.targetGroup || this.targetGroup.kind !== 'group') {
      this.messageService.add({ severity: 'error', summary: 'No group selected', detail: 'Please select a valid group.' });
      return;
    }
    const ctrlName = (this.newControl.formControl || '').toString().trim();
    if (!ctrlName) {
      this.messageService.add({ severity: 'warn', summary: 'Control name required', detail: 'Please enter a control name.' });
      return;
    }
    const control: FieldConfig = {
      kind: 'control',
      formControl: ctrlName,
      type: (this.newControl.type as any) || 'text',
      label: (this.newControl.label as any) || ctrlName,
      fieldStyle: { columns: 2, width: '100%' } as any,
      value: null
    } as any;
    this.formBuilderService.addChildToGroup(this.targetGroup, control);
    this.showAddControlDialog = false;
    this.targetGroup = null;
  }

  onDialogDrop(event: CdkDragDrop<any>) {
    if (!this.targetGroup || this.targetGroup.kind !== 'group') return;
    const tool = event.item?.data as FieldConfig;
    if (!tool) return;
    const copied = this.formBuilderService.createCopiedField(tool);
    this.formBuilderService.addChildToGroup(this.targetGroup, copied);
  }

  onFieldSelected(field: FieldConfig) {
    this.selectedField = field;
  }

  addGroup() {
    const name = prompt('Enter group name');
    if (!name || !name.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Name required', detail: 'Please provide a valid group name.' });
      return;
    }
    const keyBase = name.trim().replace(/\s+/g, '_').toLowerCase();
    const newGroup: FieldConfig = {
      // id: uuidv4(),
      kind: 'group',
      key: keyBase,
      label: name.trim(),
      fieldStyle: { columns: 4 } as any,
      children: {}
    } as any;
    this.droppedTools = [...this.droppedTools, newGroup];

    // Immediately open add-control dialog targeting this group
    this.openAddControlDialog(newGroup);
  }

  generateJson() {
    try {
      const formSchema: FormSchema = this.formBuilderService.buildExportSchema(this.droppedTools, this.title);
      this.generatedJson = exportSchema(formSchema);
      
      const ref = this.dialogService.open(JsonViewerComponent, {
        header: 'Generated Form Schema',
        width: '70%',
        contentStyle: { 'max-height': '500px', 'overflow': 'auto' },
        baseZIndex: 10000,
        data: {
          json: this.generatedJson
        }
      });
      
      ref.onClose.subscribe((copied: boolean) => {
        if (copied) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'JSON copied to clipboard!'
          });
        }
      });
      
    } catch (error) {
      console.error('Error generating JSON:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to generate JSON. Please try again.'
      });
    }
  }

  // Download the current form schema as a JSON file. This syncs current FormGroup
  // control values into droppedTools so the output reflects live values.
  downloadJson() {
    try {
      // Sync values from reactive form into droppedTools (controls only)
      this.droppedTools = this.droppedTools.map(f => {
        if (typeof f.formControl === 'string') {
          const ctrl = this.formGroup.get(f.formControl) as FormControl | null;
          if (ctrl) {
            return { ...(f as any), value: ctrl.value } as FieldConfig;
          }
        }
        return f;
      });

      const formSchema: FormSchema = this.formBuilderService.buildExportSchema(this.droppedTools, this.title);
      const json = exportSchema(formSchema);

      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const name = (this.title && this.title.trim()) ? this.title.trim() : 'form';
      a.download = `${name}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      this.messageService.add({ severity: 'success', summary: 'Download', detail: 'JSON downloaded successfully.' });
    } catch (error) {
      console.error('Error downloading JSON:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to download JSON.' });
    }
  }

  // ----- Import JSON -----
  triggerImportJson() {
    if (this.importJsonInput?.nativeElement) {
      this.importJsonInput.nativeElement.value = '';
      this.importJsonInput.nativeElement.click();
    }
  }

  onImportJsonSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const parsed = JSON.parse(text) as any;

        // Prefer the exported "controls" shape
        const controls = Array.isArray(parsed?.controls) ? parsed.controls : [];
        const nextFields: FieldConfig[] = controls.map((c: any) => {
          const data = c?.data || {};
          const style = c?.style || {};
          return {
            // id:  uuidv4(),
            kind: 'control' as any,
            formControl: data.formControlName,
            key: data.formControlName,
            type: data.fieldType as any,
            label: data.label,
            placeholder: data.placeholder,
            required: !!data.required,
            disabled: !!data.disabled,
            readonly: !!data.readonly,
            options: data.options,
            validators: data.validators,
            value: data.value,
            fieldStyle: style as any,
            componentProps: data.componentProps,
          } as any as FieldConfig;
        });

        // Fallback: if no controls, try legacy fields
        const legacyFields: FieldConfig[] = Array.isArray(parsed?.fields) ? (parsed.fields as FieldConfig[]) : [];

        if (nextFields.length > 0) {
          this.droppedTools = [...nextFields];
        } else if (legacyFields.length > 0) {
          this.droppedTools = [...legacyFields];
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Import', detail: 'No controls found in JSON.' });
          return;
        }

        // Set title if provided
        if (parsed?.formGroup && typeof parsed.formGroup === 'string') {
          this.title = parsed.formGroup;
        }

        // Rebuild the reactive form
        this.syncFormWithDroppedTools();
        this.messageService.add({ severity: 'success', summary: 'Import', detail: 'Form imported successfully.' });
      } catch (error) {
        console.error('Error importing JSON:', error);
        this.messageService.add({ severity: 'error', summary: 'Import Error', detail: 'Invalid JSON format.' });
      }
    };
    reader.readAsText(file);
  }

  openFieldEditor(field: FieldConfig) {
    if (!field) return;
    this.selectedField = field;
    this.showFieldEditor = true;
  }

  onFieldSaved(updatedField: FieldConfig) {
    if (!this.selectedField) return;
    
    const index = this.droppedTools.findIndex(f => f.formControl === this.selectedField?.formControl);
    if (index !== -1) {
      const prev = this.droppedTools[index] as any;
      const incoming: any = { ...updatedField };
      // Preserve children for containers if editor didn't send them
      if ((prev.kind === 'array' || prev.kind === 'group') && incoming.children == null) {
        incoming.children = prev.children;
      }
      // Preserve/force container nature
      if (prev.kind === 'array') {
        incoming.kind = 'array';
        incoming.type = 'array';
      } else if (prev.kind === 'group') {
        incoming.kind = 'group';
      }
      this.droppedTools[index] = {
        ...prev,
        ...incoming,
        fieldStyle: { ...(prev.fieldStyle || {}), ...(incoming.fieldStyle || {}) } as any,
      } as any;
      this.droppedTools = [...this.droppedTools];
      this.selectedField = this.droppedTools[index];
    }
    this.showFieldEditor = false;
  }
  
  onFieldEditorHide() {
    this.showFieldEditor = false;
  }

  onFieldEditorVisibleChange(visible: boolean) {
    this.showFieldEditor = visible;
  }

  removeSelectedField() {
    if (!this.selectedField) return;
    
    const index = this.droppedTools.findIndex(f => f.formControl === this.selectedField?.formControl);
    if (index !== -1) {
      this.droppedTools.splice(index, 1);
      this.droppedTools = [...this.droppedTools];
      this.selectedField = null;
    }
  }

  addField(field: any): void {
    // Generate a unique ID for the field
    const fieldWithId = {
      ...field,
      // id: uuidv4(),
      formControl: field.formControl || `field${this.droppedTools.length + 1}`,
      // Ensure disabled is a boolean
      disabled: !!field.disabled
    } as any;
    
    // Add the field to the form group
    if (fieldWithId.type !== 'file' && fieldWithId.type !== 'image' && !this.formGroup.get(fieldWithId.formControl)) {
      const control = new FormControl({
        value: this.getInitialControlValue(fieldWithId),
        disabled: fieldWithId.disabled
      });
      this.formGroup.addControl(fieldWithId.formControl, control);
    }
    
    this.droppedTools = [...this.droppedTools, fieldWithId as FieldConfig];
    this.selectedField = fieldWithId as FieldConfig;
  }

  onItemDragged(tool: any) {
    const toolExists = this.paletteTools.some(t => (t as any).type === tool.type);
    
    if (!toolExists) {
      this.paletteTools = [...this.paletteTools, { ...tool } as FieldConfig];
    }
  }

  removeTool(index: number) {
    this.droppedTools.splice(index, 1);
    this.droppedTools = [...this.droppedTools];
  }

  // Sync the built FormGroup with currently dropped tools using core factory
  private syncFormWithDroppedTools() {
    const schema: FormSchema = { id: 'temp', fields: this.droppedTools } as unknown as FormSchema;
    this.formGroup = this.formBuilderService.buildFormGroup(schema);
  }

  private getInitialControlValue(field: any) {
    switch (field.type) {
      case 'checkbox':
        return !!field.checked;
      case 'number':
        return field.value ?? null;
      case 'date':
        return field.value ?? null;
      default:
        return field.value ?? '';
    }
  }

  // ===== Array utilities (no nested arrays allowed) =====
  isArrayField(field: FieldConfig): boolean {
    return (field as any)?.kind === 'array' || (field as any)?.type === 'array';
  }

  private getArrayName(field: FieldConfig): string | null {
    const name = (field as any).formControl || (field as any).key;
    return typeof name === 'string' && name ? name : null;
  }

  getArrayControls(field: FieldConfig) {
    const name = this.getArrayName(field);
    if (!name) return [];
    const fa = this.formGroup.get(name);
    return (fa && (fa as any).controls) ? (fa as any).controls : [];
  }

  addArrayItem(field: FieldConfig) {
    const name = this.getArrayName(field);
    if (!name) return;
    const fa = this.formGroup.get(name) as any;
    if (!fa || typeof fa.push !== 'function') return;
    const rawChildren: any = (field as any).children;
    const template: FieldConfig[] = Array.isArray(rawChildren) ? rawChildren as FieldConfig[] : [];
    const itemGroup = this.fgFactory.build({ fields: template } as FormSchema);
    fa.push(itemGroup);
  }

  removeArrayItem(field: FieldConfig, index: number) {
    const name = this.getArrayName(field);
    if (!name) return;
    const fa = this.formGroup.get(name) as any;
    if (!fa || typeof fa.removeAt !== 'function') return;
    if (index < 0 || index >= fa.length) return;
    fa.removeAt(index);
  }
}
