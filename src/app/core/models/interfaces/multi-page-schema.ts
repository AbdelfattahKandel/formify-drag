import { PageConfig } from './page-config';

export interface MultiPageSchema {
  pages: PageConfig[];
}

export type MultiPageExportFormat = Array<Record<string, { groups: Record<string, unknown[]> }>>;
