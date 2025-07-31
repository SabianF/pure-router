/**
 * @typedef {import("node:http").ClientRequest} ClientRequest
 * @typedef {import("node:http").ServerResponse<ClientRequest>} ServerResponse
 */

export default class ResponseModel {
  /**
   * @type {ServerResponse}
   */
  #response;

  /**
   *
   * @param {ServerResponse} request
   */
  constructor(request) {
    this.#response = request;
  }

  /**
   *
   * @param {Number} status_code 200-599
   */
  setStatus(status_code) {
    if (
      typeof status_code !== "number" ||
      status_code < 100 ||
      status_code > 599
    ) {
      throw new Error("Missing/invalid status_code", { cause: status_code });
    }

    this.#response.statusCode = status_code;
  }

  send(data) {
    return this.#response.write(data);
  }

  end() {
    return this.#response.end();
  }
}
