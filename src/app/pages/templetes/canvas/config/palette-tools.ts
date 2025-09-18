import { FieldConfig } from '../../../../core/models/interfaces/legacy-extras';

// Canonical FieldType-based palette prototypes used by Canvas
export const PALETTE_TOOLS: FieldConfig[] = [
  {
    id: 'text-1',
    formControl: 'text',
    kind: 'control',
    key: 'text',
    type: 'input-text' as any,
    label: 'Text Input',
    fieldStyle: { width: '100%' } as any,
    options: [],
  },
  {
    id: 'password-1',
    formControl: 'password',
    kind: 'control',
    key: 'password',
    type: 'password' as any,
    label: 'Password',
    fieldStyle: { width: '100%' } as any,
    options: [],
  },
  {
    id: 'email-1',
    formControl: 'email',
    kind: 'control',
    key: 'email',
    type: 'input-text' as any,
    label: 'Email',
    fieldStyle: { width: '100%' } as any,
    options: [],
  },

  
  // Removed decorative/duplicate entries; keep only data controls

  // Numeric / masked
  {
    id: 'input-number-1',
    formControl: 'input_number',
    kind: 'control',
    key: 'input_number',
    type: 'input-number' as any,
    label: 'Number',
    fieldStyle: { width: '100%' } as any,
    options: [],
  },


  {
    id: 'datepicker-1',
    formControl: 'date',
    kind: 'control',
    key: 'date',
    type: 'datepicker' as any,
    label: 'Date Picker',
    fieldStyle: { width: '100%' } as any,
    options: [],
  },
  {
    id: 'textarea-1',
    formControl: 'textarea',
    kind: 'control',
    key: 'textarea',
    type: 'textarea' as any,
    label: 'Textarea',
    fieldStyle: { width: '100%' } as any,
    options: [],
  },
  {
    id: 'select-1',
    formControl: 'select',
    kind: 'control',
    key: 'select',
    type: 'select' as any,
    label: 'Select',
    fieldStyle: { width: '100%' } as any,
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
  },
  {
    id: 'multi-select-1',
    formControl: 'multi_select',
    kind: 'control',
    key: 'multi_select',
    type: 'multi-select' as any,
    label: 'Multi Select',
    fieldStyle: { width: '100%' } as any,
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
  },
  {
    id: 'radio-1',
    formControl: 'radio',
    kind: 'control',
    key: 'radio',
    type: 'radio' as any,
    label: 'Radio',
    fieldStyle: { width: '100%' } as any,
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
  },
  {
    id: 'checkbox-1',
    formControl: 'checkbox',
    kind: 'control',
    key: 'checkbox',
    type: 'checkbox' as any,
    label: 'Checkbox',
    fieldStyle: { width: '100%' } as any,
    options: [],
  },

  // Containers
  {
    id: 'group-1',
    kind: 'group',
    key: 'group',
    type: 'group' as any,
    label: 'Group',
    fieldStyle: { columns: 12, width: '100%' } as any,
    children: {}
  },


  // {
  //   id: 'select-button-1',
  //   formControl: 'select_button',
  //   kind: 'control',
  //   key: 'select_button',
  //   type: 'select-button' as any,
  //   label: 'Select Button',
  //   fieldStyle: { width: '100%' } as any,
  //   options: [
  //     { label: 'A', value: 'A' },
  //     { label: 'B', value: 'B' },
  //   ],
  // },

  // {
  //   id: 'toggle-switch-1',
  //   formControl: 'toggle_switch',
  //   kind: 'control',
  //   key: 'toggle_switch',
  //   type: 'toggle-switch' as any,
  //   label: 'Toggle Switch',
  //   fieldStyle: { width: '100%' } as any,
  //   options: [],
  // },

  
];
