import { ContainerStyle } from './container-style';
import { GroupNode, ArrayNode } from './nodes';

export interface SimpleFormSchema {
  id?: string;
  containerStyle?: ContainerStyle;
  root: GroupNode | ArrayNode;
}