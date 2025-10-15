import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BuilderPreferencesService } from '../../../../../core/services/builder-preferences.service';
import { StylePreference, UiLibraryPreference } from '../../../../../core/models/builder-preferences';

export interface StyleOption {
  id: StylePreference;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export interface UIOption {
  id: UiLibraryPreference;
  label: string;
  description: string;
  icon: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class SetupStylesService {
  private readonly _router = inject(Router);
  private readonly _builderPreferencesService = inject(BuilderPreferencesService);

  readonly activeIndex = signal(0);
  readonly styleChoice = signal<StylePreference | null>(null);
  readonly uiChoice = signal<UiLibraryPreference | null>(null);

  readonly styleOptions: StyleOption[] = [
    {
      id: 'tailwind',
      label: 'TailwindCSS',
      description: 'Utility-first CSS framework',
      icon: 'pi-bolt',
      color: 'blue'
    },
    {
      id: 'bootstrap',
      label: 'Bootstrap',
      description: 'Popular component library',
      icon: 'pi-box',
      color: 'purple'
    },
    {
      id: 'native',
      label: 'Native CSS',
      description: 'Pure CSS styling',
      icon: 'pi-code',
      color: 'emerald'
    }
  ];

  readonly uiOptions: UIOption[] = [
    {
      id: 'primeng',
      label: 'PrimeNG',
      description: 'Rich UI component suite with 90+ components',
      icon: 'pi-prime',
      color: 'indigo'
    },
    {
      id: 'native',
      label: 'Native Components',
      description: 'Build with standard HTML elements',
      icon: 'pi-file-word',
      color: 'amber'
    }
  ];

  private readonly _colorClasses: Record<string, { selected: string; unselected: string }> = {
    blue: {
      selected: 'border-blue-500 bg-blue-50 ',
      unselected: 'border-slate-200 text-slate-600 '
    },
    purple: {
      selected: 'border-purple-500 bg-purple-50 ',
      unselected: 'border-slate-200 '
    },
    emerald: {
      selected: 'border-emerald-500 bg-emerald-50 ',
      unselected: 'border-slate-200  '
    },
    indigo: {
      selected: 'border-indigo-500 bg-indigo-50 ',
      unselected: 'border-slate-200 '
    },
    amber: {
      selected: 'border-amber-500 bg-amber-50 ',
      unselected: 'border-slate-200'
    }
  };

  private readonly _iconColorClasses: Record<string, { selected: string; unselected: string }> = {
    blue: {
      selected: 'bg-blue-500 text-black',
      unselected: 'bg-slate-100 '
    },
    purple: {
      selected: 'bg-purple-500 text-black',
      unselected: 'bg-slate-100 '
    },
    emerald: {
      selected: 'bg-emerald-500 text-black',
      unselected: 'bg-slate-100 '
    },
    indigo: {
      selected: 'bg-indigo-500 text-black',
      unselected: 'bg-slate-100 '
    },
    amber: {
      selected: 'bg-amber-500 text-black',
      unselected: 'bg-slate-100 '
    }
  };

  private readonly _badgeColorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-amber-500'
  };

  selectStyle(option: StylePreference): void {
    this.styleChoice.set(option);
  }

  selectUI(option: UiLibraryPreference): void {
    this.uiChoice.set(option);
  }

  next(): void {
    if (this.activeIndex() < 1) {
      this.activeIndex.update((value) => value + 1);
    }
  }

  back(): void {
    if (this.activeIndex() > 0) {
      this.activeIndex.update((value) => value - 1);
    }
  }

  finish(): { style: string; ui: string } | null {
    const style = this.styleChoice();
    const ui = this.uiChoice();

    if (!style || !ui) {
      return null;
    }

    this._builderPreferencesService.setPreferences({
      styleChoice: style,
      uiChoice: ui
    });

    this._router.navigateByUrl('/node-layout');
    return { style, ui };
  }

  getColorClasses(color: string, isSelected: boolean): string {
    return isSelected ? this._colorClasses[color].selected : this._colorClasses[color].unselected;
  }

  getIconColorClasses(color: string, isSelected: boolean): string {
    return isSelected ? this._iconColorClasses[color].selected : this._iconColorClasses[color].unselected;
  }

  getBadgeColorClass(color: string): string {
    return this._badgeColorClasses[color];
  }
}
