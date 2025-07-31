import http from "node:http";
import Router from "./src/data/models/router.js";

class RequestModel {
  /**
   * @type {http.ClientRequest}
   */
  #request;

  constructor(request) {
    this.#request = request;
  }
}

function runApp() {

  const router = new Router();
  const handlers = router.request_handlers;

  const server = http.createServer(async (request, response) => {
    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
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
  });

  server.listen(3333, () => {
    console.log(`Server started at http://localhost:3333/`);
  });
}

runApp();
