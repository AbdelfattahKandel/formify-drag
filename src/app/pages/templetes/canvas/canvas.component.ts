import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal, effect, Injector, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';

// Components
import { RerenderComponent } from '../rerender/rerender.component';
import { JsonViewerComponent } from '../../../shared/components/json-viewer/json-viewer.component';

import { FieldEditorMossdeComponent } from '../../../shared/components/field-editor-mode/field-editor-mode.component';
import { UnifiedSidebarComponent } from './components/unified-sidebar/unified-sidebar.component';
import { ExportOptionsDialogComponent, ExportOptions } from '../../../shared/components/export-options-dialog/export-options-dialog.component';

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


import { FormGroupAssignComponent } from './components/form-group-assign/form-group-assign.component';
import { CreateformbuilderService } from '../../../core/services/formbuilder/createformbuilder.service';
import { FormGroupFactoryService } from '../../../core/services/formbuilder/form-group-factory.service';
import { PageManagementService } from '../../../core/services/page-management.service';
import { GroupManagementService } from '../../../core/services/group-management.service';
import { SchemaSerializerService } from '../../../core/services/formbuilder/schema-serializer.service';
import { isMultiPageFormat } from '../../../utils/import-multi-page-schema';
import { PALETTE_TOOLS } from './config/palette-tools';

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
    RerenderComponent,
    InputTextModule,
    UnifiedSidebarComponent,
    FormGroupAssignComponent
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

  // Services
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly dialogService = inject(DialogService);
  private readonly formBuilderService = inject(CreateformbuilderService);
  private readonly fgFactory = inject(FormGroupFactoryService);
  private readonly pageManagementService = inject(PageManagementService);
  private readonly groupManagementService = inject(GroupManagementService);
  private readonly schemaSerializer = inject(SchemaSerializerService);
  private readonly subs = new Subscription();
  private readonly injector = inject(Injector);

  // Form
  formGroup = this.fb.group({});
  @ViewChild('importJsonInput') importJsonInput!: ElementRef<HTMLInputElement>;
  
  // State
  isPreviewMode = signal(false);
  selectedField: FieldConfig | null = null;
  title: string = '';
  
  // Multi-page state
  currentPage = this.pageManagementService.currentPageName;
  pages = this.pageManagementService.pages;
  selectedGroup = signal<string>('');
  currentGroupNames = signal<string[]>([]);
  
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
    
    // Initialize group names for current page
    this.updateCurrentGroupNames();
    
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
  
  

  // ===== Multi-Page & Group Management =====
  
  private updateCurrentGroupNames(): void {
    const pageName = this.currentPage();
    const groupNames = this.groupManagementService.getGroupNames(pageName);
    this.currentGroupNames.set(groupNames);
  }

  onPageAdd(): void {
    const pageName = prompt('Enter new page name:');
    if (!pageName || !pageName.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Invalid Name', detail: 'Page name cannot be empty.' });
      return;
    }

    const success = this.pageManagementService.addPage(pageName.trim());
    if (success) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Page "${pageName}" added.` });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add page.' });
    }
  }

  onPageSwitch(pageName: string): void {
    this.pageManagementService.switchPage(pageName);
    this.updateCurrentGroupNames();
    this.droppedTools = [];
  }

  onPageRemove(pageName: string): void {
    const success = this.pageManagementService.removePage(pageName);
    if (success) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Page "${pageName}" removed.` });
      this.updateCurrentGroupNames();
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot remove the last page.' });
    }
  }

  onGroupAdd(groupName: string): void {
    if (!groupName || !groupName.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Invalid Name', detail: 'Form name cannot be empty.' });
      return;
    }

    const pageName = this.currentPage();
    const success = this.groupManagementService.addGroup(pageName, groupName.trim());
    if (success) {
      this.updateCurrentGroupNames();
      this.selectedGroup.set(groupName.trim());
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Form "${groupName}" added.` });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add form.' });
    }
  }

  onGroupSelect(groupName: string): void {
    // Save current form controls before switching
    if (this.selectedGroup()) {
      this.saveCurrentFormControls();
    }
    
    this.selectedGroup.set(groupName);
    
    // Load controls for the newly selected form
    this.loadCurrentFormControls();
    this.syncFormWithDroppedTools();
  }

  onGroupRemove(groupName: string): void {
    const pageName = this.currentPage();
    const success = this.groupManagementService.removeGroup(pageName, groupName);
    if (success) {
      this.updateCurrentGroupNames();
      if (this.selectedGroup() === groupName) {
        this.selectedGroup.set('');
      }
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Group "${groupName}" removed.` });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove group.' });
    }
  }

  onAssignFormToGroup(): void {
    const pageName = this.currentPage();
    const groupName = this.selectedGroup();
    
    if (!groupName) {
      this.messageService.add({ severity: 'warn', summary: 'No Group', detail: 'Please select a group first.' });
      return;
    }

    const formSchema: FormSchema = this.formBuilderService.buildExportSchema(this.droppedTools, this.title);
    formSchema.pageName = pageName;
    formSchema.groupName = groupName;

    const success = this.groupManagementService.assignFormToGroup(pageName, groupName, formSchema);
    if (success) {
      // Save controls to map instead of clearing
      this.saveCurrentFormControls();
      
      this.messageService.add({ severity: 'success', summary: 'Success', detail: `Form assigned to group "${groupName}".` });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to assign form to group.' });
    }
  }

  isEditMode: boolean = true;
  droppedTools: FieldConfig[] = [];
  
  // Store controls for each form: { pageName_groupName: FieldConfig[] }
  private formControlsMap = new Map<string, FieldConfig[]>();
  
  // Get unique key for current form
  private getCurrentFormKey(): string {
    return `${this.currentPage()}_${this.selectedGroup()}`;
  }
  
  // Load controls for current form
  private loadCurrentFormControls(): void {
    const key = this.getCurrentFormKey();
    this.droppedTools = this.formControlsMap.get(key) || [];
  }
  
  // Save controls for current form
  private saveCurrentFormControls(): void {
    const key = this.getCurrentFormKey();
    this.formControlsMap.set(key, [...this.droppedTools]);
  }


  showFieldEditor = false;
  showJsonDialog = false;
  generatedJson = '';

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const originalItem = event.previousContainer.data[event.previousIndex];
      const copiedItem: FieldConfig = this.formBuilderService.createCopiedField(originalItem as any);
      
      this.droppedTools.splice(event.currentIndex, 0, copiedItem);
      this.droppedTools = [...this.droppedTools];
      
      // Save to map after adding
      this.saveCurrentFormControls();
      
      // Ensure FormGroup has controls for new fields
      this.syncFormWithDroppedTools();
      
      this.onFieldSelected(copiedItem);
      
      // this.openFieldEditor(copiedItem);
    }
  }
  onFieldSelected(field: FieldConfig) {
    this.selectedField = field;
  }

  generateJson() {
    try {
      const pages = this.pageManagementService.getPages();
      this.generatedJson = this.schemaSerializer.exportMultiPage(pages);
      
      const ref = this.dialogService.open(JsonViewerComponent, {
        header: 'Generated Multi-Page Form Schema',
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

  // Download the multi-page form schema as a JSON file
  downloadJson() {
    try {
      const pages = this.pageManagementService.getPages();
      const json = this.schemaSerializer.exportMultiPage(pages);

      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const name = 'multi-page-form';
      a.download = `${name}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      this.messageService.add({ severity: 'success', summary: 'Download', detail: 'Multi-page JSON downloaded successfully.' });
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
        // console.log( `text: ${text}`)
        
        // Check if it's multi-page format
        if (isMultiPageFormat(text)) {
          const pages = this.schemaSerializer.importMultiPage(text);
          console.log('📥 [Import] Parsed pages:', pages);
          
          this.pageManagementService.setPages(pages);
          this.updateCurrentGroupNames();
          
          // Load controls for each form into the map
          this.formControlsMap.clear();
          pages.forEach(page => {
            Object.entries(page.groups).forEach(([groupName, groupConfig]) => {
              groupConfig.forms.forEach(form => {
                const key = `${page.pageName}_${groupName}`;
                const controls = (form.controls || []) as unknown as FieldConfig[];
                console.log(`📥 [Import] Loading controls for ${key}:`, controls);
                this.formControlsMap.set(key, controls);
              });
            });
          });
          
          // Select first group if available
          const firstGroupName = this.currentGroupNames()[0];
          if (firstGroupName) {
            this.selectedGroup.set(firstGroupName);
            console.log('📥 [Import] Selected first group:', firstGroupName);
          }
          
          // Load controls for current form
          this.loadCurrentFormControls();
          this.syncFormWithDroppedTools();
          
          console.log('📥 [Import] Loaded controls:', this.droppedTools);
          
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Import', 
            detail: `Form imported successfully with ${this.currentGroupNames().length} form(s).` 
          });
          return;
        }

        // Legacy single-page format fallback
        const parsed = JSON.parse(text) as any;
        const controls = Array.isArray(parsed?.controls) ? parsed.controls : [];
        const nextFields: FieldConfig[] = controls.map((c: any) => {
          const data = c?.data || {};
          const style = c?.style || {};
          return {
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

        const legacyFields: FieldConfig[] = Array.isArray(parsed?.fields) ? (parsed.fields as FieldConfig[]) : [];

        if (nextFields.length > 0) {
          this.droppedTools = [...nextFields];
        } else if (legacyFields.length > 0) {
          this.droppedTools = [...legacyFields];
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Import', detail: 'No controls found in JSON.' });
          return;
        }

        if (parsed?.formGroup && typeof parsed.formGroup === 'string') {
          this.title = parsed.formGroup;
        }

        this.syncFormWithDroppedTools();
        this.messageService.add({ severity: 'success', summary: 'Import', detail: 'Legacy form imported successfully.' });
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
      
      // Save after edit
      this.saveCurrentFormControls();
      
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
      
      // Save after delete
      this.saveCurrentFormControls();
    }
  }


  // Sync the built FormGroup with currently dropped tools using core factory
  private syncFormWithDroppedTools() {
    const schema: FormSchema = { id: 'temp', fields: this.droppedTools } as unknown as FormSchema;
    this.formGroup = this.formBuilderService.buildFormGroup(schema);
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
