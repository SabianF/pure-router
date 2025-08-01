import Handler from "../../domain/entities/handler.js";

/**
 * @typedef {import("../../domain/entities/types.js").HandlerFunction} HandlerFunction
 * @typedef {import("../sources/http_lib.js").default} HttpLib
 *
 * @typedef RouterProps
 * @property {HttpLib} http_lib
 */

export default class Router {
  /**
   * @type {HttpLib}
   */
  #http_lib;

  /**
   * @type {Handler[]}
   */
  #request_handlers;

  /**
   *
   * @param {RouterProps} props
   */
  constructor({ http_lib }) {
    this.#http_lib = http_lib;
    this.#request_handlers = [];
  }

  /**
   *
   * @param {HandlerFunction} handler_function
   */
  use(handler_function) {
    if (this.#request_handlers.includes(handler_function)) {
      throw new Error("Handler already exists", { cause: handler_function });
    }

    return this.#request_handlers.push(
      new Handler({
        is_middleware: true,
        handler_function: handler_function,
      }),
    );
  }

  /**
   *
   * @param {String} url
   * @param {HandlerFunction} handler_function
   */
  get(url, handler_function) {
    if (
      typeof url !== "string" &&
      url.length === 0
    ) {
      throw new Error("Missing/invalid url", { cause: url });
    }

    if (typeof handler_function !== "function") {
      throw new Error("Missing/invalid handler_function", { cause: handler_function });
    }

    return this.#request_handlers.push(
      new Handler({
        is_middleware: false,
        method: "GET",
        url: url,
        handler_function: handler_function,
      }),
    );
  }

  /**
   *
   * @param {Number} port
   * @param {function()} listen_handler_function
   */
  listen(port, listen_handler_function) {
    const server = this.#http_lib.createServer(
      async (request, response) => {
        for (let i = 0; i < this.#request_handlers.length; i++) {
          const handler = this.#request_handlers[i];
          if (handler.is_middleware) {
            await handler.handler_function(request, response);
            continue;
          }

          if (
            request.method === handler.method &&
            request.url === handler.url
          ) {
            handler.handler_function(request, response);
          }
        }
      },
    );

    return server.listen(port, listen_handler_function);
  }
}
