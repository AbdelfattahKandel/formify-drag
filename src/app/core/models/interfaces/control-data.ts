import { FieldStyle } from './field-style';
import { ValidatorConfig } from './validator-config';
import { FieldType } from './type-field';

export interface ControlData<T = string | number | boolean | unknown[] | null> {
  kind: 'control';
  key: string;
  fieldType: FieldType;
  label?: string;
  placeholder?: string;
  value?: T;
  disabled?: boolean;
  readonly?: boolean;
  validators?: ValidatorConfig[];
  asyncValidators?: unknown;
  options?: unknown;
  fieldStyle?: FieldStyle;
  tooltip?: string;
  hint?: string;
}
