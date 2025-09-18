import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

@Component({
  selector: 'app-radiobutton',
  standalone: true,
  imports: [RadioButtonModule, ReactiveFormsModule],
  templateUrl: './radiobutton.component.html',
  styleUrl: './radiobutton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class RadiobuttonComponent {
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

  inputId(idx: number): string {
    const f = this.field() as any;
    const base = (f.key || f.id || 'radio') + '';
    return `${base}_${idx}`;
  }
}
