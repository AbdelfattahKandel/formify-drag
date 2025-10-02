export type ValidatorConfig =
  | { name: 'required'; }
  | { name: 'min'; args: number }
  | { name: 'max'; args: number }
  | { name: 'minLength'; args: number }
  | { name: 'maxLength'; args: number }
  | { name: 'pattern'; args: string | RegExp }
  | { name: 'email' }
  | { name: 'custom'; args: unknown };