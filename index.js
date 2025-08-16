import Router from "./src/data/models/router.js";
import Caching from "./src/data/repositories/caching.js";
import HttpLib from "./src/data/sources/http_lib.js";
import old_fs, { promises as fs } from "node:fs";

/**
 * @typedef {Router} Router
 */

const accepted_file_exts = {
  // Standard web data
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",

  // Text
  ".txt": "text/plain",
  ".md": "text/plain",

  // Images
  "apng": "image/apng",
  "avif": "image/avif",
  "gif": "image/gif",
  "jpeg": "image/jpeg",
  "png": "image/png",
  "svg+xml": "image/svg+xml",
  "webp": "image/webp",
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
 * @returns {import("./src/data/models/router.js").MiddlewareHandlerFunction}
 */
function createStaticHandler(base_path) {
  return (next) => {
    return async (request, response) => {
      if (
        typeof base_path !== "string" ||
        base_path.length === 0
      ) {
        throw new Error("Missing/invalid path", { cause: base_path });
      }

      const normalized_base_path = base_path
        .replace(/((\\)|(\/\/))/, "/")
        .replace(/((\/)(?!.))/, "");
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
      if (
        !content_type ||
        old_fs.existsSync(sanitized_path) === false
      ) {
        next(request, response);
        return;
      }

      const file_data = await fs.readFile(sanitized_path);

      response.setHeader("Content-Type", content_type);
      response.setHeader("Cache-Control", "max-age=10");
      response.send(file_data);
      Caching.checkAndSetHash(response, file_data, request);
      response.setWasHandled();
      response.end();
    };
  };
}

export default {
  createRouter: createRouter,
  createStaticHandler: createStaticHandler
};
