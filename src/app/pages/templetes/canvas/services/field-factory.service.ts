import { Injectable } from '@angular/core';
import { FieldConfig } from '../../../../core/models/interfaces/legacy-extras';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FieldFactoryService {
  private defaultFieldTemplates: { [key: string]: Omit<FieldConfig, 'id' | 'formControl'> } = {
    text: {
      kind: 'control' as any,
      key: 'text',
      type: 'input-text' as any,
      label: 'Text Input',
      placeholder: 'Enter text',
      validators: [] as any,
      fieldStyle: { width: '100%' } as any
    },
    number: {
      kind: 'control' as any,
      key: 'number',
      type: 'input-number' as any,
      label: 'Number',
      placeholder: 'Enter a number',
      validators: [] as any,
      fieldStyle: { width: '100%' } as any
    },
    email: {
      kind: 'control' as any,
      key: 'email',
      type: 'input-text' as any,
      label: 'Email',
      placeholder: 'Enter email',
      validators: [{ name: 'email' } as any],
      fieldStyle: { width: '100%' } as any
    },
    // Add more field types as needed
  };

  createField(type: string, customProps: Partial<FieldConfig> = {}): FieldConfig {
    const baseField = this.defaultFieldTemplates[type] || this.defaultFieldTemplates['text'];
    const formControl = (customProps.formControl && String(customProps.formControl)) || `${type}_${Date.now()}`;
    
    return {
      ...baseField,
      formControl,
      ...customProps,
      validators: { ...(baseField as any).validators, ...((customProps as any).validators || {}) } as any,
      fieldStyle: { ...(baseField as any).fieldStyle, ...((customProps as any).fieldStyle || {}) } as any
    };
  }

  createGroup(fields: FieldConfig[] = [], customProps: Partial<FieldConfig> = {}): FieldConfig {
    return {
      kind: 'group' as any,
      label: (customProps as any).label || 'Group',
      formControl: (customProps as any).formControl || `group_${Date.now()}`,
      children: [...fields],
      fieldStyle: { columns: 4, width: '100%', ...((customProps as any).fieldStyle || {}) } as any
    } as any;
  }

  cloneField(field: FieldConfig): FieldConfig {
    return {
      ...(field as any),
      formControl: `${field.formControl}_${Date.now()}`
    } as any;
  }
}
