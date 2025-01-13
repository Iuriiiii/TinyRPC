/**
 * A function that manipulates a member.
 *
 * Return any value to replace the member's value.
 * Throw an error if the member has a wrong format or does not
 * comply with the member's constraints.
 */
// deno-lint-ignore no-explicit-any
export type Manipulator = (value: any, context: any) => any;
