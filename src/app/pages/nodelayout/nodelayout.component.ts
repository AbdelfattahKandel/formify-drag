import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ToggleThemeService } from '../../core/services/toggle-theme.service';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ReactiveFormsModule, FormControl, FormBuilder } from '@angular/forms';
import { Button } from "primeng/button";
import { CreateformbuilderService } from '../../core/services/formbuilder/createformbuilder.service';
import { CanvasComponent } from "../templetes/canvas/canvas.component";
import { primengTools } from './tools.config';
import { toolsMap } from './tools/tools-map';
import { AppComponent } from '../../app.component';
import { BuilderPreferencesService } from '../../core/services/builder-preferences.service';
import { Router } from '@angular/router';
import { FieldConfig } from '../../core/models/interfaces/legacy-extras';
import { UiLibraryPreference } from '../../core/models/builder-preferences';


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
  private _builderPreferencesService = inject(BuilderPreferencesService);
  private _router = inject(Router);
  readonly tabs: TabOption[] = [
    { label: 'PrimeNG', value: 'primeng', icon: 'pi pi-prime' },
    { label: 'Default', value: 'default', icon: 'pi pi-list' },
  ];

  selectionCtrl = this._fb.control<TabValue>('primeng');

  // Canonical FieldType palette prototypes
  private readonly _uiChoice = this._builderPreferencesService.uiChoice;
  private readonly _tools = computed(() => {
    const preference = this._uiChoice();
    if (!preference) {
      return primengTools;
    }
    return toolsMap[preference];
  });

  tools(): FieldConfig[] {
    return this._tools();
  }

  uiChoice(): UiLibraryPreference | null {
    return this._uiChoice();
  }

  toggleTheme() {
    this._toggleThemeService.toggleDarkMode();
    const isDark = document.documentElement.classList.contains('my-app-dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this._toggleThemeService.toggleDarkMode();
    }

    if (!this._uiChoice()) {
      this._router.navigateByUrl('/get-started');
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
