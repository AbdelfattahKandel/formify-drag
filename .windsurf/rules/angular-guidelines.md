---
trigger: always_on
---

# Angular 19 + PrimeNG 19 + Tailwind 4 + Body Style Guidelines
#persona

## General Principles
- Project uses **Angular 19**, **PrimeNG 19**, and **TailwindCSS 4**.
- Always use **standalone components** only (no NgModules).
- `changeDetection: ChangeDetectionStrategy.OnPush` is mandatory.
- Components must be **small and focused on a single responsibility**.
- Follow structured naming: **clear, descriptive variable and function names** (no abbreviations).

---
## Angular cli 
- always use angular cli like this command
ng g c shared/etc... path 
ng g s core/services/etc... path
ng g i core/models/etc... path
ng d d core/directives/etc... path
## Components & Forms
- Each component should have:
  - `.ts` file (logic)
  - `.html` file (template)
  - `.scss` or `.css` file (styles, Tailwind utilities allowed)
- Always use **Reactive Forms**, **Signals** for local state, never template-driven forms.
- Always inject FormBuilder:
  ```ts
  private _fb = inject(FormBuilder)



Example initialization pattern:


formName!: FormGroup;

initForm() {
  this.formName = this._fb.group({
    userName: ['', [Validators.required]]
  })
}

noOnInit() {
  this.initForm();
}
Inline templates only if < 10 lines.

Business logic must stay in services, not components.

State Management
Default: RxJS Observables + services for global/shared state.

Signals (Angular 19) optional for local state.

Transformations must be pure.

Strict typing required; no any allowed.

Always debug to trace errors.

Templates
Prefer Angular 19 syntax:

@for / @if /@switch @case instead of *ngFor / *ngIf / *ngSwitch.


Avoid ngClass and ngStyle; use [class] and [style] bindings.

Keep templates readable, simple, and leverage PrimeNG components.

Styling (Tailwind 4)
Global import in styles.css:

css
Copy code
@import "tailwindcss";
Never mix inline styles with Tailwind.

Use Tailwind utilities for spacing, layout, typography, colors.

Reusable patterns: use @apply in component styles.

Services
Use providedIn: 'root' for singleton services.

Services handle all business logic.

Use inject() instead of constructor injection when possible.

One service = one responsibility.

Core folder structure: core/services/servicename.ts, core/models, core/providers.

PrimeNG 19 Usage
Install:


npm install primeng@19 @primeng/themes@19 @primeng/icons
Import modules directly in standalone components.

Apply theming from primeng/themes.

Customize with Tailwind, not by overriding PrimeNG CSS.

Tooling & Formatting
Use .prettierrc:


{
  "printWidth": 140,
  "tabWidth": 2,
  "singleQuote": true,
  "useTabs": false,
  "semi": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always",
  "proseWrap": "never",
  "endOfLine": "auto"
}
Prettier must pass before commits.

Keep imports sorted and clean.

Project Structure
src/
 ├─ app/
 │   ├─ core/               # services, models, providers, interceptors
 │   ├─ shared/             # reusable components, directives, pipes
 │   ├─ features/           # feature-specific pages
 │   ├─ app.component.ts    # root component
 │   └─ app.routes.ts       # routes
 ├─ assets/                 # images, fonts, static files
 ├─ styles.css              # Tailwind import
 └─ environments/           # environment.ts files
Do & Don’t
✅ Do:

Use RxJS + Signals for state management.

Use standalone components.

Use Tailwind utilities consistently.

Format code with Prettier.

Keep business logic in services.

Use _fb = inject(FormBuilder) and initForm pattern.

❌ Don’t:

Use NgModules.

Use ngClass or ngStyle.

Use inline CSS in templates.

Leave unused imports, variables, or dead code.

Use type any.

Skip debugging to trace errors.

#Best Practices
$for: prefix Observables that are streams used in templates.


$users = this.userService.getUsers();
_for: prefix FormGroups or FormControls from FormBuilder.


_forUserForm!: FormGroup;
_forUserForm = this._fb.group({ userName: [''] });
Use Signals for local reactive state:


count = signal(0);
Always destructure services in core folder and use inject().

Keep business logic out of components, always in services.

Use OnPush for change detection for all components.

Templates: always use @for / @if for loops and conditions.

Keep components small, readable, maintainable, and reusable.