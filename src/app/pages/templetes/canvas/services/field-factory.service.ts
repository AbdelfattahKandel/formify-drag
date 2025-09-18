import { Injectable } from '@angular/core';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FieldFactoryService {
  private defaultFieldTemplates: { [key: string]: Omit<FieldConfig, 'id' | 'formControl'> } = {
    text: {
      type: 'text',
      label: 'Text Input',
      placeholder: 'Enter text',
      validators: { required: false },
      style: { width: '100%' }
    },
    number: {
      type: 'number',
      label: 'Number',
      placeholder: 'Enter a number',
      validators: { required: false },
      style: { width: '100%' }
    },
    email: {
      type: 'email',
      label: 'Email',
      placeholder: 'Enter email',
      validators: { required: false, email: true },
      style: { width: '100%' }
    },
    // Add more field types as needed
  };

  createField(type: string, customProps: Partial<FieldConfig> = {}): FieldConfig {
    const baseField = this.defaultFieldTemplates[type] || this.defaultFieldTemplates['text'];
    const id = uuidv4();
    const formControl = customProps.formControl || `${type}_${id.substring(0, 8)}`;
    
    return {
      ...baseField,
      id,
      formControl,
      ...customProps,
      validators: { ...baseField.validators, ...(customProps.validators || {}) },
      style: { ...baseField.style, ...(customProps.style || {}) }
    };
  }

  createGroup(fields: FieldConfig[] = [], customProps: Partial<FieldConfig> = {}): FieldConfig {
    return {
      id: uuidv4(),
      type: 'group',
      label: customProps.label || 'Group',
      formControl: customProps.formControl || `group_${Date.now()}`,
      fields: [...fields],
      style: { ...customProps.style }
    };
  }

  cloneField(field: FieldConfig): FieldConfig {
    return {
      ...field,
      id: uuidv4(),
      formControl: `${field.formControl}_${Date.now()}`
    };
  }
}
