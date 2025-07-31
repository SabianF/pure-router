import Router from "./src/data/models/router.js";

function testRouter() {
  const router = new Router();

  router.use((request, response) => {
    console.log(
      new Date().toISOString(),
      request.method,
      request.url,
    );
  });

  router.get("/", (request, response) => {
    response.statusCode = 200;
    response.write("<h1>Hello!</h1>");
    response.end();
  });

  router.listen(3333, () => {
    console.log("Server started at http://localhost:3333/");
  });
}

testRouter();

export default Router;
