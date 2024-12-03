export interface ExposeParam<T extends object> {
  as: string;
  enum?: T;
  /**
   * Some day..., ignore it.
   */
  schema?: T;
}
