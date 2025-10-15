import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

type SelectOption = { label: string; value: unknown; disabled?: boolean; token: string };

@Component({
  selector: 'app-native-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class NativeSelectComponent implements OnInit, OnDestroy {
  field = input.required<FieldConfig>();

  private readonly _fallbackId = `select_${crypto.randomUUID()}`;
  private readonly _selectedValue = signal<unknown | null>(null);
  private readonly _formSubscription = signal<Subscription | null>(null);

  options = computed<SelectOption[]>(() => {
    const rawOptions = (this.field() as any)?.options;
    if (!Array.isArray(rawOptions)) {
      return [];
    }
    return rawOptions.map((opt: any, index: number) => {
      const label = this.extractLabel(opt, index);
      const value = this.extractValue(opt, index);
      const disabled = this.extractDisabled(opt);
      return { label, value, disabled, token: this.createToken(value, index) };
    });
  });

  placeholder = computed(() => this.field().placeholder ?? this.field().label ?? 'Select option');

  selectedToken = computed(() => {
    const current = this._selectedValue();
    const match = this.options().find((option) => this.areEqual(option.value, current));
    return match?.token ?? '';
  });

  ngOnInit(): void {
    const control = this.formControlInst();
    if (control) {
      this._selectedValue.set(control.value ?? null);
      const subscription = control.valueChanges.subscribe((value) => {
        this._selectedValue.set(value ?? null);
      });
      this._formSubscription.set(subscription);
    } else {
      this._selectedValue.set((this.field() as any).value ?? null);
    }
  }

  ngOnDestroy(): void {
    this._formSubscription()?.unsubscribe();
  }

  onNativeChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (!target) {
      return;
    }
    this.onSelectionChange(target.value ?? '');
  }

  onSelectionChange(token: string): void {
    const option = this.options().find((opt) => opt.token === token);
    if (!option || this.isDisabled() || this.isOptionDisabled(option)) {
      return;
    }
    this.updateSelection(option.value);
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
    if (typeof key === 'string' && key.trim()) {
      return key;
    }
    const id = this.field().id;
    if (typeof id === 'string' && id.trim()) {
      return id;
    }
    if (typeof id === 'number') {
      return `select_${id}`;
    }
    return null;
  }

  controlId(): string {
    return this.controlName() ?? this._fallbackId;
  }

  isDisabled(): boolean {
    const control = this.formControlInst();
    if (control) {
      return control.disabled;
    }
    return !!this.field().disabled;
  }

  isOptionDisabled(option: SelectOption): boolean {
    return !!option.disabled;
  }

  trackOption(_: number, option: SelectOption): string {
    return option.token;
  }

  private updateSelection(value: unknown): void {
    this._selectedValue.set(value ?? null);
    const control = this.formControlInst();
    if (control) {
      control.setValue(value);
      control.markAsDirty();
      control.markAsTouched();
    } else {
      (this.field() as any).value = value;
    }
  }

  private isFormControl(value: unknown): value is FormControl {
    return value instanceof FormControl;
  }

  private extractLabel(option: unknown, index: number): string {
    if (typeof option === 'object' && option !== null && 'label' in option && typeof (option as any).label === 'string') {
      return (option as any).label;
    }
    if (typeof option === 'object' && option !== null && 'label' in option) {
      return String((option as any).label);
    }
    return String(option ?? `Option ${index + 1}`);
  }

  private extractValue(option: unknown, index: number): unknown {
    if (typeof option === 'object' && option !== null && 'value' in option) {
      return (option as any).value;
    }
    return option ?? index;
  }

  private extractDisabled(option: unknown): boolean {
    if (typeof option === 'object' && option !== null && 'disabled' in option) {
      return !!(option as any).disabled;
    }
    return false;
  }

  private createToken(value: unknown, index: number): string {
    if (value === null || value === undefined) {
      return `opt_${index}_null`;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return `opt_${index}_${btoa(encodeURIComponent(String(value)))}`;
    }
    try {
      return `opt_${index}_${btoa(encodeURIComponent(JSON.stringify(value)))}`;
    } catch {
      return `opt_${index}_hash`;
    }
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
