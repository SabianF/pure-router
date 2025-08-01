import Router from "./src/data/models/router.js";
import HttpLib from "./src/data/sources/http_lib.js";

function createRouter() {
  const http_lib = new HttpLib();
  const router = new Router({
    http_lib,
  });

  return router;
}

function testRouter() {
  const router = createRouter();

  router.use((request, response) => {
    console.log(
      new Date().toISOString(),
      request.method,
      request.url,
    );
  });

  router.get("/", (request, response) => {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html");
    response.write("<h1>Hello!</h1>");
    response.end();
  });

  router.listen(3333, () => {
    console.log("Server started at http://localhost:3333/");
  });
}

testRouter();

export default Router;
