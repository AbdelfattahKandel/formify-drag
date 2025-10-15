import { FieldConfig } from '../../../core/models/interfaces/legacy-extras';
import { UiLibraryPreference } from '../../../core/models/builder-preferences';
import { primengTools } from './primeng-tools.config';
import { nativeTools } from './native-tools.config';

export const toolsMap: Record<UiLibraryPreference, FieldConfig[]> = {
  primeng: primengTools,
  native: nativeTools
};
