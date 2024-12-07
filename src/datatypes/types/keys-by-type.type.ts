export type KeysByType<T, R> = { [K in keyof T]: T[K] extends R ? K : never }[keyof T];
