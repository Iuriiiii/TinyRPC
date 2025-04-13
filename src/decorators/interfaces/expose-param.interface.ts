export interface ExposeParam<T extends object> {
  /**
   * The name of the enum or schema to expose.
   */
  as: string;
  /**
   * The enum to expose.
   */
  enum?: T;
  /**
   * Some day..., ignore it.
   */
  schema?: T;
}
