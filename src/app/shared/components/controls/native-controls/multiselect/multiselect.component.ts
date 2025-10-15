import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';

type MultiSelectOption = { label: string; value: unknown };

@Component({
  selector: 'app-native-multiselect',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class NativeMultiselectComponent implements OnInit, OnDestroy {
  field = input.required<FieldConfig>();

  private readonly _fallbackId = `multiselect_${crypto.randomUUID()}`;
  private _formSubscription: Subscription | null = null;

  isPanelOpen = signal(false);

  options = computed<MultiSelectOption[]>(() => {
    const rawOptions = (this.field() as any)?.options;
    if (!Array.isArray(rawOptions)) {
      return [];
    }
    return rawOptions.map((opt: any, index: number) => {
      if (typeof opt === 'object' && opt !== null) {
        const label = typeof opt.label === 'string' ? opt.label : String(opt.value ?? index);
        return { label, value: opt.value };
      }
      return { label: String(opt), value: opt };
    });
  });

  placeholder = computed(() => this.field().placeholder ?? this.field().label ?? '');

  selectedValues = signal<unknown[]>([]);

  @ViewChild('rootRef', { static: true }) rootRef!: ElementRef<HTMLElement>;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isPanelOpen()) {
      return;
    }
    const root = this.rootRef?.nativeElement;
    if (!root) {
      return;
    }
    if (!root.contains(event.target as Node)) {
      this.closePanel();
    }
  }

  ngOnInit(): void {
    const control = this.formControlInst();
    if (control) {
      this.selectedValues.set(this.ensureArray(control.value));
      this._formSubscription = control.valueChanges.subscribe((value) => {
        this.selectedValues.set(this.ensureArray(value));
      });
    } else {
      this.selectedValues.set(this.ensureArray(this.field().value));
    }
  }

  ngOnDestroy(): void {
    this._formSubscription?.unsubscribe();
  }

  private ensureArray(value: unknown): unknown[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (value === null || value === undefined || value === '') {
      return [];
    }
    return [value];
  }

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
      return `multiselect_${explicitId}`;
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

  togglePanel(): void {
    if (this.isDisabled()) {
      return;
    }
    if (this.isPanelOpen()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  selectOption(option: MultiSelectOption): void {
    if (this.isDisabled()) {
      return;
    }
    const current = this.selectedValues();
    const exists = this.isSelected(option.value);
    const updated = exists ? current.filter((v) => !this.areEqual(v, option.value)) : [...current, option.value];
    this.updateSelection(updated);
  }

  clearSelection(): void {
    if (this.isDisabled()) {
      return;
    }
    this.updateSelection([]);
  }

  removeChip(value: unknown, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.isDisabled()) {
      return;
    }
    const updated = this.selectedValues().filter((v) => !this.areEqual(v, value));
    this.updateSelection(updated);
  }

  displayLabel(value: unknown): string {
    const option = this.options().find((opt) => this.areEqual(opt.value, value));
    if (option) {
      return option.label;
    }
    return String(value ?? '');
  }

  isSelected(value: unknown): boolean {
    return this.selectedValues().some((current) => this.areEqual(current, value));
  }

  openPanel(): void {
    if (!this.isDisabled()) {
      this.isPanelOpen.set(true);
    }
  }

  closePanel(): void {
    this.isPanelOpen.set(false);
  }

  trackByValue(_: number, option: MultiSelectOption): unknown {
    return option.value ?? option.label;
  }

  private updateSelection(values: unknown[]): void {
    this.selectedValues.set(values);
    const control = this.formControlInst();
    if (control) {
      control.setValue(values);
      control.markAsDirty();
      control.markAsTouched();
    } else {
      (this.field() as any).value = values;
    }
  }

  private areEqual(a: unknown, b: unknown): boolean {
    if (a === b) {
      return true;
    }
    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
      try {
        return JSON.stringify(a) === JSON.stringify(b);
      } catch(error) {
        console.error(error);
        return false;
      }
    }
    return false;
  }
}
