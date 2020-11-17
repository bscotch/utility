
class BscotchUtilError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BscotchUtilError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export function assert(claim: any, message: string) {
  if (!claim) {
    throw new BscotchUtilError(message);
  }
}