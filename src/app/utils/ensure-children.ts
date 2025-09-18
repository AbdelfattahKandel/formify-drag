import { FieldConfig } from '../core/models/interfaces/legacy-extras';

export type ChildrenType = Record<string, FieldConfig> | FieldConfig[];

export function ensureChildren(parent: FieldConfig, isGroup: boolean): ChildrenType {
  if (!parent.children || Array.isArray(parent.children) !== !isGroup) {
    parent.children = isGroup ? {} : [];
  }
  return parent.children as ChildrenType;
}
