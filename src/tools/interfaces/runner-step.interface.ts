export interface RunnerStep {
  name: string;
  // deno-lint-ignore ban-types
  step: Function;
  description?: string;
}
