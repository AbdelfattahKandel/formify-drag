import { GroupConfig } from './group-config';

export interface PageConfig {
  pageName: string;
  groups: Record<string, GroupConfig>;
}
