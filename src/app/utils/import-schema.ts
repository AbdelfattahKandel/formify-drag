import { FormSchema } from '../core/models/interfaces/form-schema';
import { FormNode } from '../core/models/interfaces/nodes';
import { validateNode } from './validate-node';

export function importSchema(json: string): FormSchema {
  try {
    const parsed = JSON.parse(json) as unknown;

    if (!parsed || typeof parsed !== 'object' || !('root' in (parsed as Record<string, unknown>))) {
      throw new Error('Schema must have a "root" node');
    }

    // Validate recursively all nodes
    validateNode(((parsed as Record<string, unknown>)['root'] as FormNode));

    return parsed as FormSchema;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    throw new Error(`Invalid JSON schema: ${message}`);
  }
}
