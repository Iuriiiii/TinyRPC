import { RunnerStep } from "../interfaces/mod.ts";

export class Runner {
  #steps: RunnerStep[] = [];
  constructor(private readonly name: string) {}

  public addStep(step: RunnerStep) {
    this.#steps.push(step);
  }

  public run(stopOnError: boolean = false) {
    console.log(`Started runner "${this.name}"`);

    for (const { name, step, description } of this.#steps) {
      console.log(`Making step "${name}"`);

      if (description) {
        console.log(`Step description: ${description}`);
      }

      try {
        step();
      } catch (error) {
        console.warn(`Error at step "${name}"`);

        if (stopOnError) {
          const message = error instanceof Error
            ? error.message
            : "No report error";

          throw new Error(
            `Runner "${this.name}" stopped, error at step "${name}": ${message}`,
          );
        }
      }
    }

    console.log(`Runner "${this.name}" done succefully!`);
  }
}
