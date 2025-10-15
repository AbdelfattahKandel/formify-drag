import { Injectable, inject } from '@angular/core';
import { FormSchema } from '../../models/interfaces/form-schema';
import { FieldConfig } from '../../models/interfaces/legacy-extras';
import { exportSchema } from '../../../utils/export-schema';
import { importSchema } from '../../../utils/import-schema';
import { sanitizeFieldName } from '../../../utils/sanitize-field-name';
import { ContainerStyle } from '../../models/interfaces/container-style';
import { PageConfig } from '../../models/interfaces/page-config';
import { MultiPageExportFormat } from '../../models/interfaces/multi-page-schema';
import { BuilderPreferencesService } from '../builder-preferences.service';

@Injectable({ providedIn: 'root' })
export class SchemaSerializerService {

  private readonly _prefs = inject(BuilderPreferencesService);

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
        formsObject[groupName] = groupConfig.forms.map((form) => {
          const transformedContainer = this.transformContainerStyle(form.containerStyle);
          const transformedControls = (form.controls || []).map((control) => this.transformControl(control));
          
          return {
            id: form.id,
            formGroup: form.formGroup || `${groupName}_group`,
            ...transformedContainer,
            controls: transformedControls,
          };
        });
      });
    });
    
    return {
      styleFramework: this._prefs.styleChoice() || 'tailwind',
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

      // Restore style framework preference if present
      if (parsed.styleFramework && ['tailwind', 'bootstrap', 'native'].includes(parsed.styleFramework)) {
        this._prefs.setStyleChoice(parsed.styleFramework);
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
      const classStr = control.class;
      
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
        cssClasses: classStr || data.cssClasses,
        uiConfig: data.uiConfig,
        validations: data.validations,
        computed: data.computed,
        conditionalLogic: data.conditionalLogic,
        dataSourceConfig: data.dataSourceConfig,
        permissions: data.permissions,
        events: data.events,
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

  /**
   * Transform container style based on selected framework
   */
  private transformContainerStyle(style: ContainerStyle | undefined): any {
    if (!style) {
      style = this.getContainerStyle();
    }

    const framework = this._prefs.styleChoice();

    if (framework === 'native') {
      // Return inline CSS object
      return style;
    }

    // Convert to class string for tailwind/bootstrap
    if (framework === 'tailwind') {
      return { containerClass: this.toTailwindContainerClasses(style) };
    }

    if (framework === 'bootstrap') {
      return { containerClass: this.toBootstrapContainerClasses(style) };
    }

    return style;
  }

  /**
   * Transform control style/class based on framework
   */
  private transformControl(control: any): any {
    const framework = this._prefs.styleChoice();

    if (framework === 'native') {
      return {
        data: control.data,
        style: control.style
      };
    }

    return {
      data: control.data,
      class: this.convertFieldStyleToClass(control.style, framework as 'tailwind' | 'bootstrap')
    };
  }

  /**
   * Convert field style object to utility class string
   */
  private convertFieldStyleToClass(style: any, framework: 'tailwind' | 'bootstrap'): string {
    if (!style) {
      return framework === 'tailwind' ? 'col-span-2 w-full' : 'col-md-6';
    }

    const columns = style.columns || 2;

    if (framework === 'tailwind') {
      return `col-span-${columns} w-full`;
    }

    // Bootstrap: 4 columns = 12-col grid
    const bsCols = Math.round((columns / 4) * 12);
    return `col-md-${bsCols}`;
  }

  /**
   * Convert ContainerStyle to Tailwind utility classes
   */
  private toTailwindContainerClasses(style: ContainerStyle): string {
    const classes: string[] = [];

    // Add base classes from cssClass, but filter out 'grid' to avoid duplication
    if (style.cssClass) {
      const baseClasses = style.cssClass.split(' ').filter(c => c !== 'grid');
      classes.push(...baseClasses);
    }
    
    // Add grid layout
    classes.push(`grid grid-cols-${style.columns || 4}`);
    
    if (style.gap) classes.push(`gap-${style.gap.replace('rem', '')}`);
    if (style.padding) classes.push(`p-${style.padding.replace('rem', '')}`);
    if (style.backgroundColor === '#ffffff') classes.push('bg-white');
    if (style.border) classes.push('border border-slate-200');
    if (style.borderRadius) classes.push('rounded-lg');
    if (style.boxShadow) classes.push('shadow-sm');
    if (style.maxWidth) classes.push('max-w-7xl');
    if (style.margin === '0 auto') classes.push('mx-auto');

    return classes.join(' ');
  }

  /**
   * Convert ContainerStyle to Bootstrap utility classes
   */
  private toBootstrapContainerClasses(style: ContainerStyle): string {
    const classes: string[] = [];

    if (style.cssClass) classes.push(style.cssClass);
    classes.push('container-fluid row');
    if (style.gap) classes.push(`g-${Math.round(parseFloat(style.gap) * 4)}`);
    if (style.padding) classes.push(`p-${Math.round(parseFloat(style.padding) * 2)}`);
    if (style.backgroundColor === '#ffffff') classes.push('bg-white');
    if (style.border) classes.push('border rounded');
    if (style.boxShadow) classes.push('shadow-sm');

    return classes.join(' ');
  }
}