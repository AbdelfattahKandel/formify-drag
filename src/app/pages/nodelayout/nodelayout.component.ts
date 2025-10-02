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
import { toolsConfig } from './tools.config';
import { AppComponent } from '../../app.component';

type TabValue = 'primeng' | 'default';
interface TabOption {
  label: string;
  value: TabValue;
  icon?: string;
}

@Component({
  selector: 'app-nodelayout',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, ReactiveFormsModule, Button, CanvasComponent, AppComponent],
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
  tools = toolsConfig.flatMap((tools) => tools) as any[];

  toggleTheme() {
    this._toggleThemeService.toggleDarkMode();
    const isDark = document.documentElement.classList.contains('my-app-dark');
    this.darkIcon = isDark ? 'pi pi-sun' : 'pi pi-moon';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this._toggleThemeService.toggleDarkMode();
      this.darkIcon = 'pi pi-sun';
    }
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
