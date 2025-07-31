/**
 * @typedef {import("./types.js").HandlerFunction} HandlerFunction
 *
 * @typedef HandlerProps
 * @property {Boolean} is_middleware
 * @property {String} method
 * @property {String} url
 * @property {HandlerFunction} handler_function
 */

export default class Handler {
  /**
   * @type {Boolean}
   */
  is_middleware;

  /**
   * @type {String}
   */
  method;

  /**
   * @type {String}
   */
  url;

  /**
   * @type {HandlerFunction}
   */
  handler_function;

  /**
   *
   * @param {HandlerProps} props
   */
  constructor({
    is_middleware,
    method,
    url,
    handler_function,
  }) {
    if (typeof is_middleware !== "boolean") {
      throw new Error("Missing/invalid is_middleware");
    }
    this.is_middleware = is_middleware;

    if (!is_middleware) {
      if (typeof method !== "string" && method.length === 0) {
        throw new Error("Missing/invalid method", { cause: method });
      }
      this.method = method;

      if (typeof url !== "string" && url.length === 0) {
        throw new Error("Missing/invalid url", { cause: url });
      }
      this.url = url;
    }

    if (typeof handler_function !== "function") {
      throw new Error("Missing/invalid handler_function", { cause: handler_function });
    }
    this.handler_function = handler_function;
  }
}
