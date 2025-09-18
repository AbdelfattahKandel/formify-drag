import { FormNode } from '../core/models/interfaces/nodes';
import { assertNever } from './assert-never';

export function validateNode(node: FormNode, path: string = ''): void {
  switch (node.kind) {
    case 'control': {
      if (!node.key) {
        throw new Error(`Control node missing "key" at path: ${path}`);
      }
      // Optionally validate fieldType exists depending on your model needs
      break;
    }
    case 'group': {
      const children = node.children;
      if (!children || Array.isArray(children) || typeof children !== 'object') {
        throw new Error(`Group node missing or invalid "children" at path: ${path || node.key}`);
      }
      for (const [childKey, childNode] of Object.entries(children)) {
        validateNode(childNode as FormNode, `${path ? path + '.' : ''}${childKey}`);
      }
      break;
    }
    case 'array': {
      const children = node.children;
      if (!Array.isArray(children)) {
        throw new Error(`Array node "children" must be an array at path: ${path || node.key}`);
      }
      children.forEach((childNode, index) => {
        validateNode(childNode, `${path || node.key}[${index}]`);
      });
      break;
    }
    default: {
      // Exhaustiveness check without accessing properties
      const _exhaustiveCheck: never = node as never;
      assertNever(_exhaustiveCheck);
    }
  }
}
