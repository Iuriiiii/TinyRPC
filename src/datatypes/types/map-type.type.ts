export type MapType<T, I, R> = {
  [P in keyof T]: T[P] extends I ? R : T[P];
};
