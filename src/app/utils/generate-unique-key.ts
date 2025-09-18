import { FieldConfig } from '../core/models/interfaces/legacy-extras';

export function generateUniqueKey(container: Record<string, FieldConfig>, child: FieldConfig): string {
  let key = (child as any).formControl || child.key || `${(child as any).type || 'node'}-${Math.floor(Math.random() * 1000)}`;

  if (container[key as string]) {
    let i = 1;
    const base = key;
    while (container[`${base}-${i++}`]) ;
    key = `${base}-${i}`;
  }

  return key;
}
