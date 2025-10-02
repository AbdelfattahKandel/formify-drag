import { FieldStyle } from './field-style';
import { FieldConfig } from './legacy-extras';
import { GroupNode, ArrayNode } from './nodes';
import { SimpleFormSchema } from './simple-form-schema';
import { FieldType } from './type-field';
import { ValidatorConfig } from './validator-config';

export type FormSchema = Omit<SimpleFormSchema, 'root'> & {
    formGroup?: string;
    groupName?: string;
    pageName?: string;
    layout?: {
      columns?: number;
      gap?: string;
      direction?: 'ltr' | 'rtl';
      alignItems?: string;
      justifyContent?: string;
    };
    fields?: (FieldConfig | GroupNode | ArrayNode)[];
    meta?: unknown;
    controls?: Array<{
      id?: string;
      data: {
        formControlName: string;
        fieldType: FieldType;
        value: unknown;
        label?: string;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        options?: unknown;
        validators?: ValidatorConfig[];
      };
      style?: FieldStyle & {
        bind?: Record<string, string>;
        class?: string;
      };
      meta?: unknown;
    }>;
  };