import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

@Component({
  selector: 'app-native-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class NativePasswordComponent {
  field = input.required<FieldConfig>();

  private readonly _fallbackId = `password_${crypto.randomUUID()}`;
  isVisible = signal(false);

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
      return `password_${explicitId}`;
    }
    const key = this.controlName();
    if (key) {
      return key;
    }
    return this._fallbackId;
  }

  isDisabled(): boolean {
    const control = this.formControlInst();
    if (control) {
      return control.disabled;
    }
    return !!this.field().disabled;
  }

  toggleVisibility(): void {
    if (this.isDisabled()) {
      return;
    }
    this.isVisible.update((value) => !value);
  }

  inputType(): 'text' | 'password' {
    return this.isVisible() ? 'text' : 'password';
  }

  placeholder(): string {
    return this.field().placeholder ?? this.field().label ?? '';
  }
}
