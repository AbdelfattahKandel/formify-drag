export const toolsConfig = [
    [
        { id: 'input-text-1', kind: 'control', key: 'input_text', type: 'input-text', label: 'Text Input', fieldStyle: { width: '100%' } },
        { id: 'password-1', kind: 'control', key: 'password', type: 'password', label: 'Password', fieldStyle: { width: '100%' } },
        { id: 'input-number-1', kind: 'control', key: 'input_number', type: 'input-number', label: 'Number', fieldStyle: { width: '100%' } },
        { id: 'datepicker-1', kind: 'control', key: 'date', type: 'datepicker', label: 'Date', fieldStyle: { width: '100%' } },
        { id: 'select-1', kind: 'control', key: 'select', type: 'select', label: 'Select', fieldStyle: { width: '100%' }, options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' }
        ] },
        { id: 'multi-select-1', kind: 'control', key: 'multi_select', type: 'multi-select', label: 'Multi Select', fieldStyle: { width: '100%' }, options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ] },
        { id: 'radio-1', kind: 'control', key: 'radio', type: 'radio', label: 'Radio', fieldStyle: { width: '100%' }, options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ] },
        { id: 'checkbox-1', kind: 'control', key: 'checkbox', type: 'checkbox', label: 'Checkbox', fieldStyle: { width: '100%' } },
        { id: 'textarea-1', kind: 'control', key: 'textarea', type: 'textarea', label: 'Textarea', fieldStyle: { width: '100%' } },
        { id: 'colorpicker-1', kind: 'control', key: 'color', type: 'colorpicker', label: 'Color', fieldStyle: { width: '100%' } },
      ] as any[]
]