export default class HttpException extends Error {
  // We need the proto before super changes the prototype chain.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructor(private status: number, message = '') {
    const actualProto = new.target.prototype;
    super(message);
    this.message = message;

    Object.setPrototypeOf(this, actualProto);
  }
}
