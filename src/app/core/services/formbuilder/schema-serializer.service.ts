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
    const baseName = (field as any).formControl || field.key || `${(field as any).type || 'node'}`;
    const key = sanitizeFieldName(baseName);
    
    return {
      data: {
        formControlName: key,
        fieldType: field.fieldType || (field as any).type,
        value: field.value ?? null,
        label: field.label,
        placeholder: field.placeholder,
        required: field.required,
        disabled: field.disabled,
        readonly: field.readonly,
        options: (field as any).options,
        validators: field.validators,
      },
      style: field.fieldStyle
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