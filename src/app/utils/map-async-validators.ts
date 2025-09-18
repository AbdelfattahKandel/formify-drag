import { AsyncValidatorFn, AbstractControl } from '@angular/forms';

export type AsyncValidatorConfig =
  | { name: 'unique'; args?: unknown }
  | { name: 'remote'; args?: unknown }
  | { name: 'custom'; args: AsyncValidatorFn | AsyncValidatorFn[] };

function warnAndFallback(name: string): AsyncValidatorFn {
  console.warn(`Unknown or invalid async validator config for "${name}", falling back to pass-through validator`);
  return async () => null;
}

export function mapAsyncValidators(configs?: AsyncValidatorConfig[]): AsyncValidatorFn[] {
  if (!configs || configs.length === 0) return [];

  return configs.map((cfg) => {
    switch (cfg.name) {
      case 'unique': {
        // Placeholder: replace with actual uniqueness call if needed
        const fn: AsyncValidatorFn = async (_control: AbstractControl) => {
          return null;
        };
        return fn;
      }
      case 'remote': {
        // Placeholder: you can use cfg.args to pass endpoint/options
        const fn: AsyncValidatorFn = async (_control: AbstractControl) => {
          return null;
        };
        return fn;
      }
      case 'custom': {
        const arg = cfg.args;
        if (typeof arg === 'function') return arg as AsyncValidatorFn;
        if (Array.isArray(arg)) {
          const fns = (arg as unknown[]).filter((f): f is AsyncValidatorFn => typeof f === 'function');
          return async (control) => {
            for (const fn of fns) {
              const res = await fn(control);
              if (res) return res; // short-circuit on first error
            }
            return null;
          };
        }
        return warnAndFallback(cfg.name);
      }
      default:
        return warnAndFallback((cfg as { name: string }).name);
    }
  });
}
