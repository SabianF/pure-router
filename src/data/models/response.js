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
   * @param {ServerResponse} response
   */
  constructor(response) {
    this.#response = response;
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
    return this;
  }

  setHeader(name, value) {
    this.#response.setHeader(name, value);
    return this;
  }

  sendHtml(html) {
    this.#response.setHeader("Content-Type", "text/html");
    this.#response.write(html);
    this.#response.end();
    return this;
  }

  send(data) {
    this.#response.write(data);
    this.#response.end();
    return this;
  }

  end() {
    this.#response.end();
    return this;
  }
}
