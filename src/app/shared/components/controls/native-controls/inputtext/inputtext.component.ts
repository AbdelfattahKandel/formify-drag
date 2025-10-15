import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldConfig } from '../../../../../core/models/interfaces/legacy-extras';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-native-inputtext',
  standalone: true,
  imports: [ReactiveFormsModule],
  
  templateUrl: './inputtext.component.html',
  styleUrls: ['./inputtext.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class NativeInputtextComponent {
  field = input.required<FieldConfig>();

  controlName(): string {
    const current = this.field();
    const fc = current.formControl;
    if (typeof fc === 'string' && fc.trim()) {
      return fc;
    }
    if (typeof current.key === 'string' && current.key.trim()) {
      return current.key;
    }
    if (current.id != null) {
      return String(current.id);
    }
    return `field_${crypto.randomUUID()}`;
  }
}
