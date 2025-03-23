export interface ServerOptions {
  timeValidation: number;
  doNotSendWarningsToClient: boolean;

  /** The transport to use. */
  transport: "tcp";

  /** The port to listen on.
   *
   * Set to `0` to listen on any available port.
   *
   * @default {8000} */
  port: number;

  /** A literal IP address or host name that can be resolved to an IP address.
   *
   * __Note about `0.0.0.0`__ While listening `0.0.0.0` works on all platforms,
   * the browsers on Windows don't work with the address `0.0.0.0`.
   * You should show the message like `server running on localhost:8080` instead of
   * `server running on 0.0.0.0:8080` if your program supports Windows.
   *
   * @default {"0.0.0.0"} */
  hostname: string;
}
