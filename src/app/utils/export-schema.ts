import { FormSchema } from '../core/models/interfaces/form-schema';

export function exportSchema(schema: FormSchema, pretty: boolean = true): string {
  return pretty ? JSON.stringify(schema, null, 2) : JSON.stringify(schema);
}
