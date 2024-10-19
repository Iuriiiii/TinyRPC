export class MissingArgumentException extends Error {
  constructor(message?: string | object) {
    super(message instanceof Object ? JSON.stringify(message) : message);
  }
}
