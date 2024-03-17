export interface RpcRequestBody {
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
}
