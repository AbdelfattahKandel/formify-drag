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

  /**
   * Builds multi-page export schema from pages configuration
   */
  buildMultiPageExportSchema(pages: PageConfig[]): MultiPageExportFormat {
    return pages.map((page) => ({
      [page.pageName]: {
        groups: Object.entries(page.groups).reduce(
          (acc, [groupName, groupConfig]) => {
            acc[groupName] = groupConfig.forms.map((form) => ({
              id: form.id,
              formGroup: form.formGroup || `${groupName}_group`,
              containerStyle: form.containerStyle || this.getContainerStyle(),
              controls: form.controls || [],
            }));
            return acc;
          },
          {} as Record<string, unknown[]>
        ),
      },
    }));
  }

  /**
   * Exports multi-page schema as JSON string
   */
  exportMultiPage(pages: PageConfig[], pretty: boolean = true): string {
    const schema = this.buildMultiPageExportSchema(pages);
    return pretty ? JSON.stringify(schema, null, 2) : JSON.stringify(schema);
  }

  /**
   * Imports multi-page schema from JSON string
   */
  importMultiPage(json: string): PageConfig[] {
    try {
      const parsed = JSON.parse(json);

      if (!Array.isArray(parsed)) {
        throw new Error('Multi-page schema must be an array');
      }

      return parsed.map((pageObj) => {
        const pageName = Object.keys(pageObj)[0];
        const pageData = pageObj[pageName];

        if (!pageData || !pageData.groups) {
          throw new Error(`Invalid page structure for "${pageName}"`);
        }

        const groups = Object.entries(pageData.groups).reduce(
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
                pageName,
                containerStyle: form.containerStyle,
                controls: form.controls,
              })),
            };

            return acc;
          },
          {} as Record<string, any>
        );

        return {
          pageName,
          groups,
        };
      });
    } catch (error) {
      console.error('Failed to import multi-page schema:', error);
      throw new Error('Invalid multi-page schema format');
    }
  }

  /**
   * Detects if JSON is multi-page format or legacy single-page format
   */
  isMultiPageFormat(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object';
    } catch {
      return false;
    }
  }
}