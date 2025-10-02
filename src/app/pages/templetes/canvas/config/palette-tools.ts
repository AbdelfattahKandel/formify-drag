import { FieldConfig } from '../../../../core/models/interfaces/legacy-extras';

// Canonical FieldType-based palette prototypes used by Canvas
export const PALETTE_TOOLS: FieldConfig[] = [
  {
    id: 'text-1',
    formControl: 'text',
    kind: 'control',
    key: 'text',
    type: 'input-text',
    label: 'Text Input',
    fieldStyle: { width: '100%' },
    options: [],
  },
  {
    id: 'password-1',
    formControl: 'password',
    kind: 'control',
    key: 'password',
    type: 'password',
    label: 'Password',
    fieldStyle: { width: '100%' },
    options: [],
  },
  {
    id: 'email-1',
    formControl: 'email',
    kind: 'control',
    key: 'email',
    type: 'input-text',
    label: 'Email',
    fieldStyle: { width: '100%' },
    options: [],
  },

  
  // Removed decorative/duplicate entries; keep only data controls

  // Numeric / masked
  {
    id: 'input-number-1',
    formControl: 'input_number',
    kind: 'control',
    key: 'input_number',
    type: 'input-number',
    label: 'Number',
    fieldStyle: { width: '100%' },
    options: [],
  },


  {
    id: 'datepicker-1',
    formControl: 'date',
    kind: 'control',
    key: 'date',
    type: 'datepicker',
    label: 'Date Picker',
    fieldStyle: { width: '100%' },
    options: [],
  },
  {
    id: 'textarea-1',
    formControl: 'textarea',
    kind: 'control',
    key: 'textarea',
    type: 'textarea',
    label: 'Textarea',
    fieldStyle: { width: '100%' },
    options: [],
  },
  {
    id: 'select-1',
    formControl: 'select',
    kind: 'control',
    key: 'select',
    type: 'select',
    label: 'Select',
    fieldStyle: { width: '100%' },
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
    type: 'multi-select',
    label: 'Multi Select',
    fieldStyle: { width: '100%' },
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
    type: 'radio',
    label: 'Radio',
    fieldStyle: { width: '100%' },
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
    type: 'checkbox',
    label: 'Checkbox',
    fieldStyle: { width: '100%' },
    options: [],
  },

  // // Image Field (uses FormArray of filenames + runtime previews)
  // {
  //   id: 'imagefield-1',
  //   formControl: 'images',
  //   kind: 'control',
  //   key: 'images',
  //   type: 'imagefield' as any,
  //   label: 'Images',
  //   fieldStyle: { width: '100%' },
  //   options: [],
  // },
  // {
  //   id: 'imageInput-1',
  //   formControl: 'image',
  //   kind: 'control',
  //   key: 'image',
  //   type: 'image-input' as any,
  //   label: 'Image Input',
  //   fieldStyle: { width: '100%' },
  //   options: [],
  // },

  // Attachment (single file name stored in a simple FormControl)
  {
    id: 'attachment-1',
    formControl: 'attachment',
    kind: 'control',
    key: 'attachment',
    type: 'attachment' as any,
    label: 'Attachment',
    fieldStyle: { width: '100%' },
    options: [],
  },

  // Containers
  // {
  //   id: 'group-1',
  //   kind: 'group',
  //   key: 'group',
  //   type: 'group' as any,
  //   label: 'Group' ,
  //   fieldStyle: { columns: 4, width: '100%' },
  //   children: {}
  // },

  // Array container
  {
    id: 'array-1',
    kind: 'array',
    key: 'items',
    type: 'array' as any,
    label: 'Array',
    fieldStyle: { columns: 4, width: '100%' },
    children: []
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
{
  id: 'submit-1',
  kind: 'control',
  key: 'submit',
  type: 'submit' as any,
  label: 'Submit',
  action: 'submit',
  fieldStyle: {
    backgroundColor: '#22c55e',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    width: '100%',
  },
  styles: {
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
  options: []
}
  
];
