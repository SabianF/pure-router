import Handler from "../../domain/entities/handler.js";

export default class Router {
  /**
   * @type {Handler[]}
   */
  request_handlers;

  constructor() {
    this.request_handlers = [];

    this.request_handlers.push(
      new Handler({
        is_middleware: true,
        handler_function: (request, response) => {
          console.log(
            new Date().toISOString(),
            request.method,
            request.url,
          );
        },
      }),
      new Handler({
        is_middleware: false,
        method: "GET",
        url: "/",
        handler_function: (request, response) => {
          response.statusCode = 200;
          response.write("<h1>Hello!</h1>");
          response.end();
        },
      }),
    );
  }
}
