import { Injectable } from '@angular/core';
import { FormSchema } from '../../models/interfaces/form-schema';
import { FieldConfig } from '../../models/interfaces/legacy-extras';
import { exportSchema } from '../../../utils/export-schema';
import { importSchema } from '../../../utils/import-schema';
import { sanitizeFieldName } from '../../../utils/sanitize-field-name';
import { ContainerStyle } from '../../models/interfaces/container-style';
import { PageConfig } from '../../models/interfaces/page-config';
import { MultiPageExportFormat } from '../../models/interfaces/multi-page-schema';

@Injectable({ providedIn: 'root' })
export class SchemaSerializerService {

  export(schema: FormSchema): string {
    return exportSchema(schema);
  }

  /**
   * Imports a schema from a JSON string
   */
  import(json: string): FormSchema {
    try {
      return importSchema(json);
    } catch (error) {
      console.error('Failed to import schema:', error);
      throw new Error('Invalid schema format');
    }
  }

  /**
   * Builds an exportable schema from the current form state
   */
  buildExportSchema(fields: FieldConfig[], formGroupTitle: string): FormSchema {
    const controls = (fields || []).map((node) => this.prepareFieldForExport(node));
    
    return {
      id: `form_${Math.floor(Math.random() * 1000) + 1}`,
      formGroup: formGroupTitle || 'form_group',
      containerStyle: this.getContainerStyle(),
      controls,
    };
  }

  protected prepareFieldForExport(field: FieldConfig): any {
    const isGroup = (field as any).kind === 'group' || (field as any).type === 'group';
    const isArray = (field as any).kind === 'array' || (field as any).type === 'array';
    const baseName = (field as any).formControl || (field as any).key || `${(field as any).type || 'node'}`;
    const key = sanitizeFieldName(baseName);

    if (isGroup) {
      // Serialize group container and its nested children recursively
      const rawChildren: any = (field as any).children;
      const list: FieldConfig[] = Array.isArray(rawChildren)
        ? (rawChildren as FieldConfig[])
        : rawChildren && typeof rawChildren === 'object'
          ? (Object.values(rawChildren) as FieldConfig[])
          : [];

      const exportName = (field as any).formControl || (field as any).key || (field as any).label || 'group';
      return {
        data: {
          formGroupName: String(exportName),
          fieldType: 'group',
          value: null,
        },
        style: (field as any).fieldStyle,
        children: list.map((child) => this.prepareFieldForExport(child)),
      };
    }

    if (isArray) {
      // Serialize array container and its nested children recursively
      const rawChildren: any = (field as any).children;
      const list: FieldConfig[] = Array.isArray(rawChildren)
        ? (rawChildren as FieldConfig[])
        : [];

      const exportName = (field as any).formControl || (field as any).key || (field as any).label || 'items';
      return {
        data: {
          formArrayName: String(exportName),
          fieldType: 'array',
          value: null,
        },
        style: (field as any).fieldStyle,
        children: list.map((child) => this.prepareFieldForExport(child)),
      };
    }

    // Leaf control
    const data: any = {
      formControlName: key,
      fieldType: (field as any).fieldType || (field as any).type,
      value: (field as any).value ?? null,
      label: (field as any).label,
      placeholder: (field as any).placeholder,
      required: (field as any).required,
      disabled: (field as any).disabled,
      readonly: (field as any).readonly,
      options: (field as any).options,
      validators: (field as any).validators,
    };
    
    // Add enhanced properties if they exist
    if ((field as any).uiConfig) {
      data.uiConfig = (field as any).uiConfig;
    }
    
    if ((field as any).validations) {
      data.validations = (field as any).validations;
    }
    
    if ((field as any).computed) {
      data.computed = (field as any).computed;
    }
    
    if ((field as any).conditionalLogic) {
      data.conditionalLogic = (field as any).conditionalLogic;
    }
    
    if ((field as any).dataSourceConfig) {
      data.dataSourceConfig = (field as any).dataSourceConfig;
    }
    
    if ((field as any).permissions) {
      data.permissions = (field as any).permissions;
    }
    
    if ((field as any).events) {
      data.events = (field as any).events;
    }
    
    if ((field as any).cssClasses) {
      data.cssClasses = (field as any).cssClasses;
    }
    
    return {
      data,
      style: (field as any).fieldStyle,
    };
  }

  protected getContainerStyle(): ContainerStyle {
    return {
      dir: 'ltr',
      cssClass: 'container grid',
      columns: 4,
      gap: '1rem',
      minHeight: '80vh',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    };
  }

  /**
   * Builds export schema from pages configuration (NEW STRUCTURE: forms only)
   */
  buildMultiPageExportSchema(pages: PageConfig[]): any {
    // New structure: { forms: { groupName: [...forms] } }
    const formsObject: Record<string, unknown[]> = {};
    
    pages.forEach((page) => {
      Object.entries(page.groups).forEach(([groupName, groupConfig]) => {
        formsObject[groupName] = groupConfig.forms.map((form) => ({
          id: form.id,
          formGroup: form.formGroup || `${groupName}_group`,
          containerStyle: form.containerStyle || this.getContainerStyle(),
          controls: form.controls || [],
        }));
      });
    });
    
    return {
      forms: formsObject
    };
  }

  /**
   * Exports multi-page schema as JSON string
   */
  exportMultiPage(pages: PageConfig[], pretty: boolean = true): string {
    const schema = this.buildMultiPageExportSchema(pages);
    return pretty ? JSON.stringify(schema, null, 2) : JSON.stringify(schema);
  }

  /**
   * Imports schema from JSON string (NEW STRUCTURE: forms only, no pages)
   */
  importMultiPage(json: string): PageConfig[] {
    try {
      const parsed = JSON.parse(json);

      // New structure: { forms: { groupName: [...forms] } }
      if (!parsed.forms || typeof parsed.forms !== 'object') {
        throw new Error('Invalid schema: "forms" object is required');
      }

      // Create a single default page containing all groups
      const defaultPageName = 'forms';
      const groups = Object.entries(parsed.forms).reduce(
        (acc, [groupName, forms]) => {
          if (!Array.isArray(forms)) {
            throw new Error(`Invalid forms array for group "${groupName}"`);
          }

          acc[groupName] = {
            groupName,
            forms: (forms as any[]).map((form) => ({
              id: form.id,
              formGroup: form.formGroup,
              groupName,
              pageName: defaultPageName,
              containerStyle: form.containerStyle,
              controls: this.convertControlsToFieldConfig(form.controls || []),
            })),
          };

          return acc;
        },
        {} as Record<string, any>
      );

      return [{
        pageName: defaultPageName,
        groups,
      }];
    } catch (error) {
      console.error('Failed to import schema:', error);
      throw new Error('Invalid schema format');
    }
  }

  /**
   * Convert imported controls to FieldConfig format
   */
  private convertControlsToFieldConfig(controls: any[]): FieldConfig[] {
    return controls.map((control: any) => {
      const data = control.data || {};
      const style = control.style || {};
      
      return {
        id: data.formControlName || `field_${Math.random().toString(36).substr(2, 9)}`,
        kind: 'control',
        key: data.formControlName,
        formControl: data.formControlName,
        type: data.fieldType,
        fieldType: data.fieldType,
        label: data.label,
        placeholder: data.placeholder,
        value: data.value,
        required: data.required,
        disabled: data.disabled,
        readonly: data.readonly,
        options: data.options,
        validators: data.validators,
        fieldStyle: style,
        uiConfig: data.uiConfig,
        validations: data.validations,
        computed: data.computed,
        conditionalLogic: data.conditionalLogic,
        dataSourceConfig: data.dataSourceConfig,
        permissions: data.permissions,
        events: data.events,
        cssClasses: data.cssClasses,
      } as any;
    });
  }

  /**
   * Detects if JSON is the new format with "forms" object
   */
  isMultiPageFormat(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      // New format: { forms: { ... } }
      return parsed && typeof parsed === 'object' && parsed.forms && typeof parsed.forms === 'object';
    } catch {
      return false;
    }
  }
}