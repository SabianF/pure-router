import Handler from "../../domain/entities/handler.js";
import notFoundPage from "../../domain/presentation/pages/not_found.js";
import ResponseModel from "./response.js";

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
    const default_not_found_handler = new Handler({
      is_middleware: true,
      handler_function: (request, response) => {
        response.setStatus(404);
        response.setHeader("Content-Type", "text/html");
        response.sendHtml(notFoundPage(request.url));
        response.end();
      },
    });
    this.#request_handlers.push(default_not_found_handler);

    /**
     * @type {HandlerFunction}
     */
    const request_listener = async (request, response) => {
      const response_model = new ResponseModel(response);

      for (let i = 0; i < this.#request_handlers.length; i++) {
        const handler = this.#request_handlers[i];

        if (response.writableEnded) {
          break;
        }

        if (handler.is_middleware) {
          await handler.handler_function(request, response_model);
          continue;
        }

        if (
          request.method === handler.method &&
          request.url === handler.url
        ) {
          await handler.handler_function(request, response_model);
        }
      }
    };
    const server = this.#http_lib.createServer(request_listener);

    return server.listen(port, listen_handler_function);
  }
}
