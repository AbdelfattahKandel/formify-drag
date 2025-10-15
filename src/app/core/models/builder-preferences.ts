export type UiLibraryPreference = 'primeng' | 'native';
export type StylePreference = 'tailwind' | 'bootstrap' | 'native';

export interface BuilderPreferences {
  uiChoice: UiLibraryPreference | null;
  styleChoice: StylePreference | null;
}
