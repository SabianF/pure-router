import Handler from "../../domain/entities/handler.js";
import notFoundPage from "../../domain/presentation/pages/not_found.js";
import ResponseModel from "./response.js";
import crypto from "node:crypto";

/**
 * @typedef {import("../../domain/entities/types.js").ClientHandlerFunction} ClientHandlerFunction
 * @typedef {import("../../domain/entities/types.js").HandlerFunction} HandlerFunction
 * @typedef {import("../sources/http_lib.js").default} HttpLib
 *
 * @typedef RouterProps
 * @property {HttpLib} http_lib
 */

/**
 * @callback MiddlewareHandlerFunction
 * @param {ClientHandlerFunction} next
 * @returns {ClientHandlerFunction}
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

  /** @type {MiddlewareHandlerFunction[]}  */
  #middleware;

  /**
   *
   * @param {RouterProps} props
   */
  constructor({ http_lib }) {
    this.#http_lib = http_lib;
    this.#request_handlers = [];
    this.#middleware = [];
  }

  /**
   *
   * @param {ClientHandlerFunction} handler_function
   */
  use(handler_function) {
    return this.#middleware.push(handler_function);
  }

  /**
   *
   * @param {String} url
   * @param {ClientHandlerFunction} handler_function
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
    /**
     * @type {ClientHandlerFunction}
     */
    const request_listener = async (request, response_model) => {

      // Handle client requests

      for (const handler of this.#request_handlers) {
        if (handler.method !== request.method) {
          continue;
        }
        if (handler.url !== request.url) {
          continue;
        }
        await handler.handler_function(request, response_model);
        response_model.setWasHandled();
        break;
      }

      // Return 404 if not found

      if (response_model.getWasHandled() === false) {
        response_model.setStatus(404);
        response_model.setHeader("Content-Type", "text/html");
        response_model.sendHtml(notFoundPage(request.url));
        response_model.end();
        return;
      }

      // Return 304 if client requests unchanged data they already have

      if (!response_model.getBody()) {
        return;
      }

      const response_data_hash = crypto
        .createHash("md5")
        .update(response_model.getBody())
        .digest("base64");

      if (request.headers["if-none-match"] === response_data_hash) {
        response_model.setStatus(304);
        response_model.clearBody();
      }

      response_model.setHeader("ETag", response_data_hash);

      // Send response

      response_model.end();
    };

    // Handle middleware

    /** @type {ClientHandlerFunction} */
    let wrapped_listener = request_listener;
    for (let i = this.#middleware.length - 1; i >= 0; i--) {
      const middleware = this.#middleware[i];
      wrapped_listener = middleware(wrapped_listener);
    }

    // Start server

    const server = this.#http_lib.createServer((request, response) => {
      const response_model = new ResponseModel(response);
      return wrapped_listener(request, response_model);
    });

    return server.listen(port, listen_handler_function);
  }
}
