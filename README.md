# Formify Drag & Build (Angular 19 + PrimeNG 19 + TailwindCSS 4)

Formify is a drag-and-drop form builder powered by Angular 19, PrimeNG 19, and Tailwind 4. Build forms visually, edit fields, nest groups, and export your schema as JSON.

## Tech Stack
- Angular 19 (standalone components, OnPush)
- PrimeNG 19 (+ Prime Icons, themes)
- TailwindCSS 4
- CDK Drag & Drop

## Quick Start
```bash
npm install
npm start    # alias for: ng serve
```
Open http://localhost:4200

## NPM Scripts
- `npm start` – run dev server
- `npm run build` – production build
- `npm run L` or `ng lint` – lint (if configured)

## Project Structure
```
src/app/
 ├─ core/                 # services, models, providers
 ├─ shared/               # reusable controls/components
 │   └─ components/
 │       ├─ controls/primeng-controls/*   # PrimeNG-based form controls
 │       ├─ container-formgroup/          # nested FormGroup container
 │       └─ field-editor-mode/            # field editor modal
 ├─ pages/
 │   └─ templetes/
 │       ├─ canvas/                       # palette + canvas + export
 │       ├─ rerender/                     # renderer that paints a field by type
 │       └─ ...
 └─ pages/nodelayout/                     # app shell (toolbar, theme toggle)
```

## Key Features
- Drag & Drop from palette to canvas
- Renderer paints fields by canonical `type` (`input-text`, `password`, `select`, `radio`, `checkbox`, `input-number`, `datepicker`, `textarea`, `colorpicker`, `group`)
- Nested `group` containers using `[formGroupName]` and CDK drop zones (add controls or groups inside groups)
- Field Editor modal:
  - Edit label, key, type, columns, width, options, required, placeholder, value
  - Live value sync: typing in editor updates reactive FormControl immediately
- Download JSON: exports current schema including live control values

## Architecture & Conventions
- Standalone components only. All with `ChangeDetectionStrategy.OnPush`.
- Reactive Forms everywhere. Template-driven forms avoided except in editor UI (ngModel) which emits events to update reactive state.
- Business logic in services under `core/services`.
- Renderer uses Angular 19 template control flow `@switch`, `@case`, `@if`, `@for`.
- Tailwind utility classes for layout/spacing/typography. Prefer CSS variables from PrimeNG for theming.
- Avoid `ngClass`/`ngStyle` where possible; prefer `[class]`/`[style]` bindings or Tailwind classes.

## Coding Guidelines Summary
- Angular CLI generators (examples):
  - `ng g c shared/components/...`  `ng g s core/services/...`  `ng g i core/models/...`
- Strict typing, avoid `any` (except temporary migration spots)
- Signals for local state where suitable; services + RxJS for shared state
- Import PrimeNG modules directly in standalone components
- Keep components small and focused

## How to Use
1) Drag a control from the left palette onto the canvas
2) Select a control and press “Edit Selected” to open the Field Editor
3) Change properties; value changes are synced live to the reactive form
4) Use “Download JSON” to export the current schema
5) Use `group` from palette to create nested sections; drop fields/groups inside

## Theming
The shell header logo and buttons use PrimeNG CSS variables so it adapts automatically to light/dark theme:
- `--p-primary-color`, `--p-text-color`, `--p-surface-800`, `--p-highlight-bg`

## Current Audit (vs internal guidelines)
- ✅ Standalone components, OnPush used broadly (`RerenderComponent`, controls, group container)
- ✅ Renderer uses Angular 19 `@switch/@case` and `@if/@for`
- ✅ PrimeNG 19 components imported locally per standalone component
- ✅ Drag-and-drop containers wired via CDK
- ✅ Live value sync from Field Editor to Reactive Form
- ✅ JSON export (download) reflects live values

Action items to improve consistency
- [nodelayout/nodelayout.component.html]
  - Replace leftover inline `[style]` bindings on buttons with Tailwind + theme classes, or move to CSS using variables
  - Replace `[ngClass]="darkIcon"` with `[class]` bound to a computed class string, or use Tailwind’s dark: variants if possible
- Replace remaining `as any` casts with proper types in:
  - `shared/components/controls/*` helper methods and field access
  - `pages/templetes/canvas/*` (e.g., updating `droppedTools`)
- Ensure every control template avoids mixed inline styles; use `styleClass`/`inputStyleClass` and Tailwind utilities
- Consider adding ESLint config to enforce OnPush, standalone, and no `any`
- Add unit tests for:
  - Field Editor save + live value sync
  - Group nesting builder (`createformbuilder.service`)
  - JSON export schema

## Contributing
1) Create a branch
2) Follow guidelines above (standalone + OnPush, Reactive Forms, Tailwind, no `any`)
3) Run Prettier before commit
4) Open a PR

## License
MIT (c) 2025 Formify Team

[
  users:[
    {
  "id": "form_156",
  "formGroup": "form_group",
  "containerStyle": {
    "dir": "ltr",
    "cssClass": "container grid",
    "columns": 4,
    "gap": "1rem",
    "minHeight": "80vh",
    "width": "100%",
    "maxWidth": "1400px",
    "margin": "0 auto",
    "padding": "2rem",
    "border": "1px solid #e2e8f0",
    "borderRadius": "0.5rem",
    "backgroundColor": "#ffffff",
    "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  "controls": [
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "password",
        "fieldType": "password",
        "value": null,
        "label": "Password",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "date",
        "fieldType": "datepicker",
        "value": null,
        "label": "Date Picker",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "select",
        "fieldType": "select",
        "value": null,
        "label": "Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "textarea",
        "fieldType": "textarea",
        "value": null,
        "label": "Textarea",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "checkbox",
        "fieldType": "checkbox",
        "value": null,
        "label": "Checkbox",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "multi_select",
        "fieldType": "multi-select",
        "value": null,
        "label": "Multi Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "attachment",
        "fieldType": "attachment",
        "value": null,
        "label": "Attachment",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formArrayName": "array",
        "fieldType": "array",
        "value": null
      },
      "style": {
        "columns": 4,
        "width": "100%"
      },
      "children": []
    },
    {
      "data": {
        "formControlName": "submit",
        "fieldType": "submit",
        "value": null,
        "label": "Submit",
        "placeholder": "",
        "options": [],
        "validators": []
      },
      "style": {
        "columns": 4,
        "width": "100%",
        "backgroundColor": "#22c55e",
        "padding": "0.5rem 1rem",
        "borderRadius": "2rem"
      }
    }
  ]
},
{
  "id": "form_156",
  "formGroup": "form_group",
  "containerStyle": {
    "dir": "ltr",
    "cssClass": "container grid",
    "columns": 4,
    "gap": "1rem",
    "minHeight": "80vh",
    "width": "100%",
    "maxWidth": "1400px",
    "margin": "0 auto",
    "padding": "2rem",
    "border": "1px solid #e2e8f0",
    "borderRadius": "0.5rem",
    "backgroundColor": "#ffffff",
    "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  "controls": [
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "password",
        "fieldType": "password",
        "value": null,
        "label": "Password",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "date",
        "fieldType": "datepicker",
        "value": null,
        "label": "Date Picker",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "select",
        "fieldType": "select",
        "value": null,
        "label": "Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "textarea",
        "fieldType": "textarea",
        "value": null,
        "label": "Textarea",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "checkbox",
        "fieldType": "checkbox",
        "value": null,
        "label": "Checkbox",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "multi_select",
        "fieldType": "multi-select",
        "value": null,
        "label": "Multi Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "attachment",
        "fieldType": "attachment",
        "value": null,
        "label": "Attachment",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formArrayName": "array",
        "fieldType": "array",
        "value": null
      },
      "style": {
        "columns": 4,
        "width": "100%"
      },
      "children": []
    },
    {
      "data": {
        "formControlName": "submit",
        "fieldType": "submit",
        "value": null,
        "label": "Submit",
        "placeholder": "",
        "options": [],
        "validators": []
      },
      "style": {
        "columns": 4,
        "width": "100%",
        "backgroundColor": "#22c55e",
        "padding": "0.5rem 1rem",
        "borderRadius": "2rem"
      }
    }
  ]
},
{
  "id": "form_156",
  "formGroup": "form_group",
  "containerStyle": {
    "dir": "ltr",
    "cssClass": "container grid",
    "columns": 4,
    "gap": "1rem",
    "minHeight": "80vh",
    "width": "100%",
    "maxWidth": "1400px",
    "margin": "0 auto",
    "padding": "2rem",
    "border": "1px solid #e2e8f0",
    "borderRadius": "0.5rem",
    "backgroundColor": "#ffffff",
    "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  "controls": [
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "password",
        "fieldType": "password",
        "value": null,
        "label": "Password",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "date",
        "fieldType": "datepicker",
        "value": null,
        "label": "Date Picker",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "select",
        "fieldType": "select",
        "value": null,
        "label": "Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "textarea",
        "fieldType": "textarea",
        "value": null,
        "label": "Textarea",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "checkbox",
        "fieldType": "checkbox",
        "value": null,
        "label": "Checkbox",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "multi_select",
        "fieldType": "multi-select",
        "value": null,
        "label": "Multi Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "attachment",
        "fieldType": "attachment",
        "value": null,
        "label": "Attachment",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formArrayName": "array",
        "fieldType": "array",
        "value": null
      },
      "style": {
        "columns": 4,
        "width": "100%"
      },
      "children": []
    },
    {
      "data": {
        "formControlName": "submit",
        "fieldType": "submit",
        "value": null,
        "label": "Submit",
        "placeholder": "",
        "options": [],
        "validators": []
      },
      "style": {
        "columns": 4,
        "width": "100%",
        "backgroundColor": "#22c55e",
        "padding": "0.5rem 1rem",
        "borderRadius": "2rem"
      }
    }
  ]
}
  ],
  ofers: [
    {
  "id": "form_156",
  "formGroup": "form_group",
  "containerStyle": {
    "dir": "ltr",
    "cssClass": "container grid",
    "columns": 4,
    "gap": "1rem",
    "minHeight": "80vh",
    "width": "100%",
    "maxWidth": "1400px",
    "margin": "0 auto",
    "padding": "2rem",
    "border": "1px solid #e2e8f0",
    "borderRadius": "0.5rem",
    "backgroundColor": "#ffffff",
    "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  "controls": [
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "password",
        "fieldType": "password",
        "value": null,
        "label": "Password",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "date",
        "fieldType": "datepicker",
        "value": null,
        "label": "Date Picker",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "select",
        "fieldType": "select",
        "value": null,
        "label": "Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "textarea",
        "fieldType": "textarea",
        "value": null,
        "label": "Textarea",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "checkbox",
        "fieldType": "checkbox",
        "value": null,
        "label": "Checkbox",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "multi_select",
        "fieldType": "multi-select",
        "value": null,
        "label": "Multi Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "attachment",
        "fieldType": "attachment",
        "value": null,
        "label": "Attachment",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formArrayName": "array",
        "fieldType": "array",
        "value": null
      },
      "style": {
        "columns": 4,
        "width": "100%"
      },
      "children": []
    },
    {
      "data": {
        "formControlName": "submit",
        "fieldType": "submit",
        "value": null,
        "label": "Submit",
        "placeholder": "",
        "options": [],
        "validators": []
      },
      "style": {
        "columns": 4,
        "width": "100%",
        "backgroundColor": "#22c55e",
        "padding": "0.5rem 1rem",
        "borderRadius": "2rem"
      }
    }
  ]
},
{
  "id": "form_156",
  "formGroup": "form_group",
  "containerStyle": {
    "dir": "ltr",
    "cssClass": "container grid",
    "columns": 4,
    "gap": "1rem",
    "minHeight": "80vh",
    "width": "100%",
    "maxWidth": "1400px",
    "margin": "0 auto",
    "padding": "2rem",
    "border": "1px solid #e2e8f0",
    "borderRadius": "0.5rem",
    "backgroundColor": "#ffffff",
    "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  "controls": [
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "password",
        "fieldType": "password",
        "value": null,
        "label": "Password",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "date",
        "fieldType": "datepicker",
        "value": null,
        "label": "Date Picker",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "select",
        "fieldType": "select",
        "value": null,
        "label": "Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "textarea",
        "fieldType": "textarea",
        "value": null,
        "label": "Textarea",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "checkbox",
        "fieldType": "checkbox",
        "value": null,
        "label": "Checkbox",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "multi_select",
        "fieldType": "multi-select",
        "value": null,
        "label": "Multi Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "attachment",
        "fieldType": "attachment",
        "value": null,
        "label": "Attachment",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formArrayName": "array",
        "fieldType": "array",
        "value": null
      },
      "style": {
        "columns": 4,
        "width": "100%"
      },
      "children": []
    },
    {
      "data": {
        "formControlName": "submit",
        "fieldType": "submit",
        "value": null,
        "label": "Submit",
        "placeholder": "",
        "options": [],
        "validators": []
      },
      "style": {
        "columns": 4,
        "width": "100%",
        "backgroundColor": "#22c55e",
        "padding": "0.5rem 1rem",
        "borderRadius": "2rem"
      }
    }
  ]
},
{
  "id": "form_156",
  "formGroup": "form_group",
  "containerStyle": {
    "dir": "ltr",
    "cssClass": "container grid",
    "columns": 4,
    "gap": "1rem",
    "minHeight": "80vh",
    "width": "100%",
    "maxWidth": "1400px",
    "margin": "0 auto",
    "padding": "2rem",
    "border": "1px solid #e2e8f0",
    "borderRadius": "0.5rem",
    "backgroundColor": "#ffffff",
    "boxShadow": "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  "controls": [
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "text",
        "fieldType": "input-text",
        "value": null,
        "label": "Text Input",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "password",
        "fieldType": "password",
        "value": null,
        "label": "Password",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "input_number",
        "fieldType": "input-number",
        "value": null,
        "label": "Number",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "date",
        "fieldType": "datepicker",
        "value": null,
        "label": "Date Picker",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "select",
        "fieldType": "select",
        "value": null,
        "label": "Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "textarea",
        "fieldType": "textarea",
        "value": null,
        "label": "Textarea",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "checkbox",
        "fieldType": "checkbox",
        "value": null,
        "label": "Checkbox",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "multi_select",
        "fieldType": "multi-select",
        "value": null,
        "label": "Multi Select",
        "options": [
          {
            "label": "Option 1",
            "value": "option1"
          },
          {
            "label": "Option 2",
            "value": "option2"
          }
        ]
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formControlName": "attachment",
        "fieldType": "attachment",
        "value": null,
        "label": "Attachment",
        "options": []
      },
      "style": {
        "columns": 2,
        "width": "100%"
      }
    },
    {
      "data": {
        "formArrayName": "array",
        "fieldType": "array",
        "value": null
      },
      "style": {
        "columns": 4,
        "width": "100%"
      },
      "children": []
    },
    {
      "data": {
        "formControlName": "submit",
        "fieldType": "submit",
        "value": null,
        "label": "Submit",
        "placeholder": "",
        "options": [],
        "validators": []
      },
      "style": {
        "columns": 4,
        "width": "100%",
        "backgroundColor": "#22c55e",
        "padding": "0.5rem 1rem",
        "borderRadius": "2rem"
      }
    }
  ]
}
  ]
]