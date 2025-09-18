import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CheckboxModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CheckboxComponent {
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
}
