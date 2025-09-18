import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';



@Component({
  selector: 'app-inputtext',
  standalone: true,
  imports: [InputTextModule, ReactiveFormsModule],
  templateUrl: './inputtext.component.html',
  styleUrl: './inputtext.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class InputtextComponent {
  field = input.required<FieldConfig>();

  isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControl as any;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field().formControl as any;
    return typeof fc === 'string' ? fc : null;
  }
}
