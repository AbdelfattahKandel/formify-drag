import { ValidatorFn, Validators } from '@angular/forms';
import { ValidatorConfig } from '../core/models/interfaces/validator-config';

function warnAndFallback(name: string): ValidatorFn {
  console.warn(`Unknown or invalid validator config for "${name}", using nullValidator`);
  return Validators.nullValidator;
}

export function mapValidators(configs?: ValidatorConfig[]): ValidatorFn[] {
  if (!configs || configs.length === 0) return [];

  return configs.map((cfg) => {
    switch (cfg.name) {
      case 'required':
        return Validators.required;
      case 'min':
        return typeof cfg.args === 'number' ? Validators.min(cfg.args) : warnAndFallback(cfg.name);
      case 'max':
        return typeof cfg.args === 'number' ? Validators.max(cfg.args) : warnAndFallback(cfg.name);
      case 'minLength':
        return typeof cfg.args === 'number' ? Validators.minLength(cfg.args) : warnAndFallback(cfg.name);
      case 'maxLength':
        return typeof cfg.args === 'number' ? Validators.maxLength(cfg.args) : warnAndFallback(cfg.name);
      case 'pattern': {
        if (typeof cfg.args === 'string') return Validators.pattern(cfg.args);
        if (cfg.args instanceof RegExp) return Validators.pattern(cfg.args);
        return warnAndFallback(cfg.name);
      }
      case 'email':
        return Validators.email;
      case 'custom': {
        const arg = cfg.args;
        if (typeof arg === 'function') return arg as ValidatorFn;
        if (Array.isArray(arg)) {
          const fns = (arg as unknown[]).filter((f): f is ValidatorFn => typeof f === 'function');
          if (!fns.length) return Validators.nullValidator;
          return (control) => {
            for (const fn of fns) {
              const res = fn(control);
              if (res) return res;
            }
            return null;
          };
        }
        return Validators.nullValidator;
      }
      default:
        return warnAndFallback((cfg as { name: string }).name);
    }
  });
}
