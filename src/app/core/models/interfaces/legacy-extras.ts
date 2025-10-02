import { FieldStyle } from './field-style';
import { FieldType } from './type-field';
import { ValidatorConfig } from './validator-config';
import { FormControl } from '@angular/forms';

export type LegacyExtras = {
  id?: string | number;
  formControl?: string | FormControl;
  label?: string | null;
  placeholder?: string;
  fieldStyle?: FieldStyle;
  type?: FieldType; // legacy alias
  fieldType?: FieldType;
  value?: any;
  validators?: ValidatorConfig[];
  asyncValidators?: any;
  options?: any;
  dataSource?: any;
  hidden?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  
  // Regex validation pattern (consumed by Validators.pattern)
  pattern?: string;
  inputAttrs?: Record<string, string | number | boolean>;
  componentProps?: Record<string, any>;
  meta?: any;
  group?: string;
  tooltip?: string;
  hint?: string;
  
  // Button specific properties
  action?: 'submit' | 'reset' | 'button' | string;
  
  // Style related properties
  styles?: Record<string, any>;
  css?: Record<string, any>;
  
};
export interface FieldConfig extends LegacyExtras {
  kind: 'control' | 'group' | 'array';
  key: string;
  children?: Record<string, FieldConfig> | FieldConfig[];
}
