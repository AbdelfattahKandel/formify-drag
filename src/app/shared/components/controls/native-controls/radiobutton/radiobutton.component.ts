import { ChangeDetectionStrategy, Component, OnInit, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

type RadioOption = { label: string; value: unknown; disabled?: boolean };

@Component({
  selector: 'app-native-radiobutton',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class NativeRadiobuttonComponent implements OnInit {
  field = input.required<FieldConfig>();

  private readonly _fallbackId = `radio_${crypto.randomUUID()}`;
  private readonly _controlContainer = inject(ControlContainer, { optional: true });

  private readonly _localValue = signal<unknown | null>(null);

  options = computed<RadioOption[]>(() => {
    const rawOptions = (this.field() as any)?.options;
    if (!Array.isArray(rawOptions)) {
      return [];
    }
    return rawOptions.map((option: any, index: number) => {
      if (typeof option === 'object' && option !== null) {
        const label = typeof option.label === 'string' ? option.label : String(option.value ?? index);
        const disabled = typeof option.disabled === 'boolean' ? option.disabled : false;
        return { label, value: option.value, disabled };
      }
      return { label: String(option), value: option };
    });
  });

  placeholder = computed(() => this.field().placeholder ?? this.field().label ?? '');

  ngOnInit(): void {
    const existing = (this.field() as any).value;
    if (existing !== undefined) {
      this._localValue.set(existing);
    }
  }

  private isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  private formControlNameFromField(): string | null {
    const fc = this.field().formControl as unknown;
    if (typeof fc === 'string' && fc.trim()) {
      return fc;
    }
    return null;
  }

  formControlInst(): FormControl | null {
    const fc = this.field().formControl as unknown;
    if (this.isFormControl(fc)) {
      return fc;
    }
    const controlName = this.formControlNameFromField();
    if (controlName && this._controlContainer?.control) {
      const control = this._controlContainer.control.get(controlName);
      if (control instanceof FormControl) {
        return control;
      }
    }
    return null;
  }

  controlName(): string | null {
    const name = this.formControlNameFromField();
    if (name) {
      return name;
    }
    const key = this.field().key;
    if (typeof key === 'string' && key.trim()) {
      return key;
    }
    const id = this.field().id;
    if (typeof id === 'string' && id.trim()) {
      return id;
    }
    if (typeof id === 'number') {
      return `radio_${id}`;
    }
    return null;
  }

  controlId(): string {
    return this.controlName() ?? this._fallbackId;
  }

  optionId(index: number): string {
    return `${this.controlId()}_${index}`;
  }

  groupName(): string {
    return this.controlName() ?? this.controlId();
  }

  isDisabled(): boolean {
    const control = this.formControlInst();
    if (control) {
      return control.disabled;
    }
    return !!this.field().disabled;
  }

  isOptionDisabled(option: RadioOption): boolean {
    return this.isDisabled() || !!option.disabled;
  }

  isSelectedOption(value: unknown): boolean {
    const control = this.formControlInst();
    if (control) {
      return this.areEqual(control.value, value);
    }
    const existing = (this.field() as any).value;
    if (existing !== undefined && existing !== null) {
      return this.areEqual(existing, value);
    }
    return this.areEqual(this._localValue(), value);
  }

  onInputChange(value: unknown): void {
    const control = this.formControlInst();
    if (control) {
      (this.field() as any).value = value;
      return;
    }
    this._localValue.set(value);
    (this.field() as any).value = value;
  }

  trackByValue(index: number, option: RadioOption): unknown {
    return option.value ?? `${this.controlId()}_${index}`;
  }

  private areEqual(a: unknown, b: unknown): boolean {
    if (a === b) {
      return true;
    }
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
      try {
        return JSON.stringify(a) === JSON.stringify(b);
      } catch {
        return false;
      }
    }
    return false;
  }
}
