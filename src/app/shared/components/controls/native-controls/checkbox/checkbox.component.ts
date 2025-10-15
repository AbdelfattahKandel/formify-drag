import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

@Component({
  selector: 'app-native-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class NativeCheckboxComponent {
  field = input.required<FieldConfig>();
  private readonly _fallbackId = `checkbox_${Math.random().toString(36).slice(2, 9)}`;

  private isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControl as unknown;
    return this.isFormControl(fc) ? fc : null;
  }

  controlName(): string | null {
    const fc = this.field().formControl as unknown;
    if (typeof fc === 'string' && fc.trim()) {
      return fc;
    }
    const key = this.field().key;
    return typeof key === 'string' && key.trim() ? key : null;
  }

  controlId(): string {
    const explicitId = this.field().id;
    if (typeof explicitId === 'string' && explicitId.trim()) {
      return explicitId;
    }
    if (typeof explicitId === 'number') {
      return `checkbox_${explicitId}`;
    }
    const key = this.controlName();
    if (key) {
      return key;
    }
    return this._fallbackId;
  }
}
