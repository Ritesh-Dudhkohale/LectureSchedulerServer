class CustomError extends Error {
  constructor(statusCode = 500, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errorStack = "errorStack";
  }
}

export default CustomError;
