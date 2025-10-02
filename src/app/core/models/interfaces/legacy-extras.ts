import { FieldStyle } from './field-style';
import { FieldType } from './type-field';
import { ValidatorConfig } from './validator-config';
import { FormControl } from '@angular/forms';
import { UIConfig, ComputedConfig, AdvancedValidation, ConditionalConfig, DataSourceConfig, PermissionsConfig } from './enhanced-field-config';

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
  
  // Enhanced features
  uiConfig?: UIConfig;
  computed?: ComputedConfig;
  validations?: AdvancedValidation;
  conditionalLogic?: ConditionalConfig[];
  dataSourceConfig?: DataSourceConfig;
  permissions?: PermissionsConfig;
  
  // Events
  events?: {
    onChange?: string;
    onBlur?: string;
    onFocus?: string;
  };
  
  // Custom CSS
  cssClasses?: {
    container?: string;
    label?: string;
    input?: string;
    error?: string;
    helpText?: string;
  };
  
  // Field dependencies
  dependencies?: {
    dependsOn: string;
    dataSource?: DataSourceConfig;
    trigger?: 'change' | 'blur';
  };
};

export interface FieldConfig extends LegacyExtras {
  kind: 'control' | 'group' | 'array';
  key: string;
  children?: Record<string, FieldConfig> | FieldConfig[];
}
