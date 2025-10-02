import { PageConfig } from '../core/models/interfaces/page-config';
import { GroupConfig } from '../core/models/interfaces/group-config';
import { FormSchema } from '../core/models/interfaces/form-schema';

export function importMultiPageSchema(json: string): PageConfig[] {
  try {
    const parsed = JSON.parse(json);

    if (!Array.isArray(parsed)) {
      throw new Error('Multi-page schema must be an array');
    }

    return parsed.map((pageObj) => {
      const pageName = Object.keys(pageObj)[0];
      const pageData = pageObj[pageName];

      if (!pageData || typeof pageData !== 'object') {
        throw new Error(`Invalid page structure for "${pageName}"`);
      }

      if (!pageData.groups || typeof pageData.groups !== 'object') {
        throw new Error(`Missing or invalid groups in page "${pageName}"`);
      }

      const groups: Record<string, GroupConfig> = {};

      Object.entries(pageData.groups).forEach(([groupName, forms]) => {
        if (!Array.isArray(forms)) {
          throw new Error(`Invalid forms array for group "${groupName}"`);
        }

        groups[groupName] = {
          groupName,
          forms: (forms as Array<Record<string, unknown>>).map((form) => ({
            id: form['id'] as string | undefined,
            formGroup: form['formGroup'] as string | undefined,
            groupName,
            pageName,
            containerStyle: form['containerStyle'] as FormSchema['containerStyle'],
            controls: form['controls'] as FormSchema['controls'],
          })) as FormSchema[],
        };
      });

      return {
        pageName,
        groups,
      };
    });
  } catch (error) {
    console.error('Failed to import multi-page schema:', error);
    throw new Error(`Invalid multi-page schema format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function isMultiPageFormat(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return false;
    }

    const firstItem = parsed[0];
    if (typeof firstItem !== 'object' || firstItem === null) {
      return false;
    }

    const keys = Object.keys(firstItem);
    if (keys.length === 0) {
      return false;
    }

    const firstPageData = firstItem[keys[0]];
    return (
      typeof firstPageData === 'object' &&
      firstPageData !== null &&
      'groups' in firstPageData &&
      typeof firstPageData.groups === 'object'
    );
  } catch {
    return false;
  }
}
