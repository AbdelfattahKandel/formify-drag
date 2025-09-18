import { ControlData } from './control-data';

export interface GroupNode {
  kind: 'group';
  key: string;
  children: Record<string, FormNode>;
}
export type FormNode = ControlData | GroupNode | ArrayNode;

export interface ArrayNode {
  kind: 'array';
  key: string;
  children: FormNode[];
  minItems?: number;
  maxItems?: number;
  canAdd?: boolean;
  canRemove?: boolean;
}
