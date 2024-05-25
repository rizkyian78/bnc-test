class ApiErrorParser {
  constructor(public error: unknown) {}

  toString() {
    return this.formatError(this.error);
  }

  formatError(arg: any) {
    return arg.response.data.message;
  }
}

export default ApiErrorParser;
