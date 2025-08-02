import Router from "./src/data/models/router.js";
import HttpLib from "./src/data/sources/http_lib.js";
import old_fs, { promises as fs } from "node:fs";
import notFoundPage from "./src/domain/presentation/pages/not_found.js";

/**
 * @typedef {Router} Router
 */

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
   * @type {import("./src/domain/entities/types.js").ClientHandlerFunction}
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
      response.setStatus(404);
      response.sendHtml(notFoundPage(sanitized_path));
      return;
    }

    const file_data = await fs.readFile(sanitized_path);

    response.setHeader("Content-Type", content_type);
    response.setHeader("Cache-Control", "max-age=10");
    response.send(file_data);
    response.setWasHandled();
  };

  return handler;
}

export default {
  createRouter: createRouter,
  createStaticHandler: createStaticHandler
};
