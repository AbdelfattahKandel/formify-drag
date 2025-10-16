export type FieldType =
  | 'checkbox' // CheckboxModule
  | 'datepicker' // DatePickerModule
  | 'input-group' // InputGroupModule

  | 'input-number' // InputNumberModule
  | 'input-text' // InputTextModule
  | 'array' // FormArrayModule

  | 'multi-select' // MultiSelectModule
  | 'password' // PasswordModule
  | 'radio' // RadioButtonModule
  | 'select' // SelectModule
  | 'textarea' // TextareaModule
  | 'attachment'; // Custom Image Field (FormArray of filenames)
