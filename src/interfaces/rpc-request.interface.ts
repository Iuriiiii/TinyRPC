export interface RpcRequest<T extends object = object> extends Request {
  rpc: {
    // deno-lint-ignore ban-types
    procedure: Function;
    // deno-lint-ignore no-explicit-any
    instance: any;
    /**
     * The arguments received from the client.
     * In object format.
     */
    // arguments: Record<string, unknown>;
    /**
     * Array of arguments, ready for .call or .apply.
     */
    pushableArguments: unknown[];
    // client: T;
    // rawBody: Uint8Array;
  };
}
