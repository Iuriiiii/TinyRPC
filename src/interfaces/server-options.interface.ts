export interface ServerOptions extends Deno.ServeTcpOptions {
  timeValidation: number;
  doNotSendWarningsToClient: boolean;
}
