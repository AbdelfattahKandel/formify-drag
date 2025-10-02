import { FieldConfig } from '../../../../core/models/interfaces/legacy-extras';

export type QuickAddType = 'input-text' | 'textarea' | 'select' | 'multi-select' | 'radio' | 'checkbox' | 'imagefield' | 'array' | 'datepicker' |  'input-number' | 'password' | 'group' ;

export interface QuickAddTool {
  type: QuickAddType;
  label: string;
  styleClass?: string;
  openDialog?: boolean; // when true, component should open a naming dialog instead of addPreset
}

// Default quick-add tools for Group containers (no array inside by default here)
export const QUICK_ADD_GROUP_TOOLS: QuickAddTool[] = [
  { type: 'input-text', label: 'Text', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'password', label: 'Password', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'textarea', label: 'Textarea', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'select', label: 'Select', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'multi-select', label: 'Multiselect', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'radio', label: 'radio', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'datepicker', label: 'Datepicker', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'input-number', label: 'Number', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'checkbox', label: 'Checkbox', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'imagefield', label: 'Images', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'group', label: 'Group', styleClass: 'p-button-sm p-button-help', openDialog: true },
];

// Default quick-add tools for Array containers (includes nested array via dialog)
export const QUICK_ADD_ARRAY_TOOLS: QuickAddTool[] = [
  { type: 'input-text', label: 'Text', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'password', label: 'Password', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'textarea', label: 'Textarea', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'select', label: 'Select', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'radio', label: 'radio', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'multi-select', label: 'Multiselect', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'datepicker', label: 'Datepicker', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'input-number', label: 'Number', styleClass: 'p-button-sm p-button-secondary' },
  { type: 'checkbox', label: 'Checkbox', styleClass: 'p-button-sm p-button-secondary' },
  // { type: 'imagefield', label: 'Images', styleClass: 'p-button-sm p-button-secondary' },
];
