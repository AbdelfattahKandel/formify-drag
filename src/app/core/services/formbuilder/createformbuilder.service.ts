import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormSchema } from '../../models/interfaces/form-schema';
import { FieldConfig } from '../../models/interfaces/legacy-extras';
import { inject } from '@angular/core';
import { FormGroupFactoryService } from './form-group-factory.service';
import { FieldFactoryService } from './field-factory.service';
import { SchemaSerializerService } from './schema-serializer.service';
import { ensureChildren, ChildrenType } from '../../../utils/ensure-children';
import { generateUniqueKey } from '../../../utils/generate-unique-key';

@Injectable({
  providedIn: 'root'
})
export class CreateformbuilderService {

  private readonly schemaSubject = new BehaviorSubject<FormSchema>({
    id: `form_${Date.now()}`,
    layout: { columns: 2 },
    fields: []
  });

  readonly schema$ = this.schemaSubject.asObservable();

  protected formGroupFactory = inject(FormGroupFactoryService);
  protected fieldFactory = inject(FieldFactoryService);
  protected schemaSerializer = inject(SchemaSerializerService);

  // Getters and Setters
  get currentSchema(): FormSchema {
    return this.schemaSubject.value;
  }

  setSchema(schema: FormSchema): void {
    this.schemaSubject.next({ ...schema });
  }

  // Field Operations
  addField(field: FieldConfig): void {
    this.updateFields(fields => [...fields, field]);
  }

  updateField(id: string, updates: Partial<FieldConfig>): void {
    this.updateFields(fields => 
      fields.map(field => field.id === id ? { ...field, ...updates } : field)
    );
  }

  removeField(id: string): void {
    this.updateFields(fields => fields.filter(f => f.id !== id));
  }

  // Schema Operations
  buildFormGroup(schema: FormSchema) {
    return this.formGroupFactory.build(schema);
  }

  createCopiedField(field: FieldConfig): FieldConfig {
    return this.fieldFactory.createCopy(field);
  }

  // Container Operations
  addChildToGroup(parent: FieldConfig, child: FieldConfig): void {
    if (parent.kind !== 'group') return;
    this.updateContainerChildren(parent, child, true);
  }

  addItemToArray(parent: FieldConfig, child: FieldConfig): void {
    console.log('🔵 [Service] addItemToArray called', {
      parentKind: parent.kind,
      childType: child.type,
      childLabel: child.label
    });
    if (parent.kind !== 'array') {
      return;
    }
    this.updateContainerChildren(parent, child, false);
  }

  // Import/Export
  buildExportSchema(fields: FieldConfig[], formGroupTitle: string): FormSchema {
    return this.schemaSerializer.buildExportSchema(fields, formGroupTitle);
  }

  export(): string {
    return this.schemaSerializer.export(this.currentSchema);
  }
  
  import(json: string): void {
    this.setSchema(this.schemaSerializer.import(json));
  }

  // Private Helpers
  protected updateFields(updater: (fields: FieldConfig[]) => FieldConfig[]): void {
    const currentFields = this.currentSchema.fields || [];
    this.setSchema({
      ...this.currentSchema,
      fields: updater(currentFields)
    });
  }

  protected updateContainerChildren(
    parent: FieldConfig, 
    child: FieldConfig, 
    isGroup: boolean
  ): void {
    console.log('🔵 [Service] updateContainerChildren', {
      isGroup,
      parentLabel: (parent as any).label,
      childType: child.type,
      currentChildrenCount: Array.isArray(parent.children) ? parent.children.length : Object.keys(parent.children || {}).length
    });
    
    const children = isGroup 
      ? (ensureChildren(parent, isGroup) as Record<string, FieldConfig>)
      : (ensureChildren(parent, isGroup) as FieldConfig[]);
    
    if (isGroup) {
      const uniqueKey = generateUniqueKey(children as Record<string, FieldConfig>, child);
      (children as Record<string, FieldConfig>)[uniqueKey] = { ...child, key: uniqueKey };
      parent.children = { ...(children as Record<string, FieldConfig>) };
    } else {
      (children as FieldConfig[]).push(child);
      parent.children = [...(children as FieldConfig[])];
      console.log('✅ [Service] تم إضافة العنصر للـ Array. العدد الجديد:', (parent.children as FieldConfig[]).length);
    }
    
    this.triggerSchemaUpdate();
  }

  private triggerSchemaUpdate(): void {
    this.setSchema({
      ...this.currentSchema,
      fields: [...(this.currentSchema.fields || [])]
    });
  }
}
