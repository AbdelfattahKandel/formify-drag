import { FormSchema } from '../core/models/interfaces/form-schema';
import { PageConfig } from '../core/models/interfaces/page-config';
import { MultiPageExportFormat } from '../core/models/interfaces/multi-page-schema';

export function exportSchema(schema: FormSchema, pretty: boolean = true): string {
  return pretty ? JSON.stringify(schema, null, 2) : JSON.stringify(schema);
}

export function exportMultiPageSchema(pages: PageConfig[], pretty: boolean = true): string {
  const output: MultiPageExportFormat = pages.map((page) => ({
    [page.pageName]: {
      groups: Object.entries(page.groups).reduce(
        (acc, [groupName, groupConfig]) => {
          acc[groupName] = groupConfig.forms;
          return acc;
        },
        {} as Record<string, unknown[]>
      ),
    },
  }));

  return pretty ? JSON.stringify(output, null, 2) : JSON.stringify(output);
}
