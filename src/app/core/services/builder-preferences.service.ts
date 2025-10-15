import { Injectable, computed, signal } from '@angular/core';
import { BuilderPreferences, StylePreference, UiLibraryPreference } from '../models/builder-preferences';

@Injectable({
  providedIn: 'root'
})
export class BuilderPreferencesService {
  private readonly _uiChoice = signal<UiLibraryPreference | null>(null);
  private readonly _styleChoice = signal<StylePreference | null>(null);

  readonly uiChoice = this._uiChoice.asReadonly();
  readonly styleChoice = this._styleChoice.asReadonly();
  readonly preferences = computed<BuilderPreferences>(() => ({
    uiChoice: this._uiChoice(),
    styleChoice: this._styleChoice()
  }));

  setUiChoice(choice: UiLibraryPreference | null): void {
    this._uiChoice.set(choice);
  }

  setStyleChoice(choice: StylePreference | null): void {
    this._styleChoice.set(choice);
  }

  setPreferences(preferences: BuilderPreferences): void {
    this._uiChoice.set(preferences.uiChoice);
    this._styleChoice.set(preferences.styleChoice);
  }

  reset(): void {
    this._uiChoice.set(null);
    this._styleChoice.set(null);
  }
}
