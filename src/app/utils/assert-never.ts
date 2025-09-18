export function assertNever(x: never): never {
  throw new Error(`Unknown node kind: ${String(x)}`);
}
