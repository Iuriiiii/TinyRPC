export interface RpcRequestBody<T = object> {
  /**
   * Module
   */
  m: string;
  /**
   * Function
   */
  fn: string;
  /**
   * Arguments
   */
  args: object[];

  mbr: T;
}
