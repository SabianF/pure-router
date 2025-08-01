import Router from "./src/data/models/router.js";
import HttpLib from "./src/data/sources/http_lib.js";
import old_fs, { promises as fs } from "node:fs";
import notFoundPage from "./src/domain/presentation/pages/not_found.js";

const accepted_file_exts = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
};

function createRouter() {
  const http_lib = new HttpLib();
  const router = new Router({
    http_lib,
  });

  return router;
}

/**
 *
 * @param {String} base_path
 */
function createStaticHandler(base_path) {
  if (
    typeof base_path !== "string" ||
    base_path.length === 0
  ) {
    throw new Error("Missing/invalid path", { cause: base_path });
  }

  const normalized_base_path = base_path
    .replace(/((\\)|(\/\/))/, "/")
    .replace(/((\/)(?!.))/, "");

  /**
   * @type {import("./src/domain/entities/types.js").HandlerFunction}
   */
  const handler = async (request, response) => {
    const sanitized_path = (normalized_base_path + request.url)
      .replace(/^(\.\.[\/\\])+/, "");

    /**
     * @type {String}
     */
    let content_type;
    for (const file_ext in accepted_file_exts) {
      if (sanitized_path.endsWith(file_ext)) {
        content_type = accepted_file_exts[file_ext];
      }
    }
    if (!content_type) {
      return;
    }

    if (old_fs.existsSync(sanitized_path) === false) {
      response.statusCode = 404;
      response.write(notFoundPage(sanitized_path));
      response.end();
      return;
    }

    const file_data = await fs.readFile(sanitized_path);

    response.setHeader("Content-Type", content_type);
    response.write(file_data);
    response.end();
  };

  return handler;
}

function testRouter() {
  const router = createRouter();

  router.use(createStaticHandler("public/"));

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
    response.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport"  content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible"  content="ie=edge">
          <title>Not found</title>
          <link rel="stylesheet" href="global.css">
        </head>
        <body>
          <h1>Hello, there!</h1>
        </body>
      </html>
    `);
    response.end();
  });

  router.listen(3333, () => {
    console.log("Server started at http://localhost:3333/");
  });
}

testRouter();

export default Router;
