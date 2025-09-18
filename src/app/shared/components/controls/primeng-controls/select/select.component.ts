import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [SelectModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SelectComponent {
  field = input.required<FieldConfig>();

  private isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControl as unknown;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field().formControl as unknown;
    return typeof fc === 'string' ? fc : null;
  }

  options() {
    const f = this.field() as any;
    return Array.isArray(f.options) ? f.options : [];
  }
}
