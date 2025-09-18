import { Injectable } from '@angular/core';
import { FormSchema } from '../../models/interfaces/form-schema';
import { FieldConfig } from '../../models/interfaces/legacy-extras';
import { exportSchema } from '../../../utils/export-schema';
import { importSchema } from '../../../utils/import-schema';
import { sanitizeFieldName } from '../../../utils/sanitize-field-name';
import { ContainerStyle } from '../../models/interfaces/container-style';

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
    return {
      data: {
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
      },
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
}