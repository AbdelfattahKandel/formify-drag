import { FieldStyle } from './field-style';
import { FieldType } from './type-field';
import { ValidatorConfig } from './validator-config';

/**
 * UI Customization Configuration
 */
export interface UIConfig {
  icon?: string;
  iconPosition?: 'left' | 'right';
  helpText?: string;
  prefix?: string;
  suffix?: string;
  characterCounter?: {
    enabled: boolean;
    max?: number;
    showRemaining?: boolean;
  };
  theme?: {
    labelColor?: string;
    borderColor?: string;
    focusColor?: string;
    backgroundColor?: string;
  };
}

/**
 * Computed Field Configuration
 */
export interface ComputedConfig {
  formula: string; // e.g., "quantity * price" or "field1 + field2"
  dependencies: string[]; // field names that affect this computation
  trigger?: 'change' | 'blur' | 'manual';
  format?: string; // e.g., "currency", "percentage", "decimal"
}

/**
 * Advanced Validation Configuration
 */
export interface AdvancedValidation {
  required?: {
    value: boolean;
    message?: string;
  };
  email?: {
    value: boolean;
    message?: string;
  };
  min?: {
    value: number;
    message?: string;
  };
  max?: {
    value: number;
    message?: string;
  };
  minLength?: {
    value: number;
    message?: string;
  };
  maxLength?: {
    value: number;
    message?: string;
  };
  pattern?: {
    value: string | RegExp;
    message?: string;
  };
  custom?: {
    validator: string; // function name or expression
    message?: string;
  };
  async?: {
    endpoint: string;
    method?: 'GET' | 'POST';
    debounce?: number;
    message?: string;
  };
}

/**
 * Conditional Logic Configuration
 */
export interface ConditionalConfig {
  condition: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
    value?: any;
  };
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
  targetFields?: string[];
}

/**
 * Data Source Configuration for dynamic options
 */
export interface DataSourceConfig {
  type: 'api' | 'static' | 'computed';
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  valueField?: string | null;
  labelField?: string | null;
  cache?: boolean;
  cacheDuration?: number;
  headers?: Record<string, string>;
  transform?: string;
  params?: Record<string, any>;
}

/**
 * Field Permissions Configuration
 */
export interface PermissionsConfig {
  view?: string[]; // roles that can view this field
  edit?: string[]; // roles that can edit this field
  required?: string[]; // roles for which this field is required
}

/**
 * Enhanced Field Configuration with all new features
 */
export interface EnhancedFieldConfig {
  // Existing properties
  formControl?: string;
  label?: string;
  placeholder?: string;
  fieldType?: FieldType;
  value?: any;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;

  // Enhanced features
  uiConfig?: UIConfig;
  computed?: ComputedConfig;
  validations?: AdvancedValidation;
  conditionalLogic?: ConditionalConfig[];
  dataSource?: DataSourceConfig;
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
}
