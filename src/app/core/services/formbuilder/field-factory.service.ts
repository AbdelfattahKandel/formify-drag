import { Injectable } from '@angular/core';
import { FieldConfig } from '../../models/interfaces/legacy-extras';
import { FieldStyle } from '../../models/interfaces/field-style';
import { sanitizeFieldName } from '../../../utils/sanitize-field-name';



@Injectable({
  providedIn: 'root'
})
export class FieldFactoryService {

  constructor() { }
  normalizeStyle(style?: FieldStyle): FieldStyle | undefined {
    if (!style) return undefined;
    
    return {
      ...style,
      width: typeof (style as any).width === 'number' ? `${(style as any).width}px` : style.width,
      columns: style.columns
    };
  }

  /**
   * Creates a deep copy of a field with a new ID
   */
  createCopy(original: FieldConfig): FieldConfig {
    const baseId = `${original.type}-${Math.floor(Math.random() * 1000)}`;
    const baseKey = `${ original.type || 'field'}`;

    if (original.kind === 'group') {
      return { 
        kind: 'group', 
        id: baseId, 
        key: baseKey, 
        children: {}, 
        label: original.label || 'Group' 
      };
    }

    // Preserve arrays as containers and keep their formControl as entered (for JSON export)
    if (original.kind === 'array' || (original as any).type === 'array') {
      const clonedChildren = Array.isArray((original as any).children)
        ? JSON.parse(JSON.stringify((original as any).children))
        : [];
      const cloned: FieldConfig = {
        kind: 'array',
        id: baseId,
        key: baseKey,
        label: (original as any).label,
        fieldStyle: this.normalizeStyle((original as any).fieldStyle) as any,
        // keep the raw formControl name (could be non-Latin) for export
        ...(original as any).formControl ? { formControl: (original as any).formControl } as any : {},
        type: (original as any).type,
        children: clonedChildren as any,
      } as any;
      return cloned;
    }

    // Default: treat as control
    const cloned: FieldConfig = {
      ...(JSON.parse(JSON.stringify(original)) as FieldConfig),
      id: baseId,
      key: baseKey,
      kind: 'control',
      fieldType: original.fieldType || original.type,
    };
    // Ensure formControl is a valid string name
    const desiredName = (original as any).formControl || (original as any).key || (original as any).label || baseKey;
    (cloned as any).formControl = sanitizeFieldName(String(desiredName));
    const normalized = this.normalizeStyle({ 
      columns: 2, 
      width: '100%', 
      ...(original.fieldStyle || {}) 
    }) || { columns: 1, width: '100%' };
    (cloned as any).fieldStyle = normalized;
    return cloned;
  }
}
