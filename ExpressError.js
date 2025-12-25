// ExpressError.js (recommended)
class ExpressError extends Error {
  constructor(message = "Something went wrong", status = 500) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ExpressError;
