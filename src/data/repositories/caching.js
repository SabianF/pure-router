import crypto from "node:crypto";
import ResponseModel from "../models/response.js";
import { IncomingMessage } from "node:http";

export default class Caching {
  /**
   *
   * @param {ResponseModel} response_model
   * @param {import("node:crypto").BinaryLike} data
   * @param {IncomingMessage} request
   */
  static checkAndSetHash(response_model, data, request) {
    const response_data_hash = crypto
      .createHash("md5")
      .update(data)
      .digest("base64");

    if (request.headers["if-none-match"] === response_data_hash) {
      response_model.setStatus(304);
      response_model.clearBody();
    }

    response_model.setHeader("ETag", response_data_hash);
  }
}
