import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToggleThemeService } from '../../core/services/toggle-theme.service';
import { CommonModule } from '@angular/common';
import { PaletteComponent } from '../templetes/palette/palette.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ReactiveFormsModule, FormControl, FormBuilder } from '@angular/forms';
import { Button } from "primeng/button";
import { DropAreaComponent } from "../templetes/drop-area/drop-area.component";
import { CreateformbuilderService } from '../../core/services/formbuilder/createformbuilder.service';
import { CanvasComponent } from "../templetes/canvas/canvas.component";

type TabValue = 'primeng' | 'default';
interface TabOption {
  label: string;
  value: TabValue;
  icon?: string;
}

@Component({
  selector: 'app-nodelayout',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, ReactiveFormsModule, Button, CanvasComponent],
  templateUrl: './nodelayout.component.html',
  styleUrls: ['./nodelayout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodelayoutComponent {
  
  
  private _fb = inject(FormBuilder);
  private _toggleThemeService = inject(ToggleThemeService);
  private _formBuilderService = inject(CreateformbuilderService);
  darkIcon: string = 'pi pi-moon';
  readonly tabs: TabOption[] = [
    { label: 'PrimeNG', value: 'primeng', icon: 'pi pi-prime' },
    { label: 'Default', value: 'default', icon: 'pi pi-list' },
  ];

  selectionCtrl = this._fb.control<TabValue>('primeng');

  // Canonical FieldType palette prototypes
  tools = [
    { id: 'input-text-1', kind: 'control', key: 'input_text', type: 'input-text', label: 'Text Input', fieldStyle: { width: '100%' } },
    { id: 'password-1', kind: 'control', key: 'password', type: 'password', label: 'Password', fieldStyle: { width: '100%' } },
    { id: 'input-number-1', kind: 'control', key: 'input_number', type: 'input-number', label: 'Number', fieldStyle: { width: '100%' } },
    { id: 'datepicker-1', kind: 'control', key: 'date', type: 'datepicker', label: 'Date', fieldStyle: { width: '100%' } },
    { id: 'select-1', kind: 'control', key: 'select', type: 'select', label: 'Select', fieldStyle: { width: '100%' }, options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' }
    ] },
    { id: 'multi-select-1', kind: 'control', key: 'multi_select', type: 'multi-select', label: 'Multi Select', fieldStyle: { width: '100%' }, options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ] },
    { id: 'radio-1', kind: 'control', key: 'radio', type: 'radio', label: 'Radio', fieldStyle: { width: '100%' }, options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ] },
    { id: 'checkbox-1', kind: 'control', key: 'checkbox', type: 'checkbox', label: 'Checkbox', fieldStyle: { width: '100%' } },
    { id: 'textarea-1', kind: 'control', key: 'textarea', type: 'textarea', label: 'Textarea', fieldStyle: { width: '100%' } },
    { id: 'colorpicker-1', kind: 'control', key: 'color', type: 'colorpicker', label: 'Color', fieldStyle: { width: '100%' } },
  ] as any[];

  toggleTheme() {
    this._toggleThemeService.toggleDarkMode();
    const isDark = document.documentElement.classList.contains('my-app-dark');
    this.darkIcon = isDark ? 'pi pi-sun' : 'pi pi-moon';
  }

  onSave() {
    try {
      const json = this._formBuilderService.export();
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-schema-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export schema', e);
    }
  }
}
