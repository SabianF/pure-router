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
   * @type {Boolean}
   */
  #was_handled;

  /**
   * @type {String}
   */
  #body;

  /**
   *
   * @param {ServerResponse} response
   */
  constructor(response) {
    this.#response = response;
    this.#was_handled = false;
    this.#body = "";
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
    this.#body += html;
    return this;
  }

  send(data) {
    this.#body = data;
    return this;
  }

  /**
   * Writes the current data to the response, sending it to the client
   */
  write() {
    if (!this.#response.writableEnded) {
      this.#response.write(this.#body);
    }
    return this;
  }

  setWasHandled() {
    this.#was_handled = true;
  }

  getWasHandled() {
    return this.#was_handled;
  }

  /**
   * Writes the current data to the response, sending it to the client, and closes the response
   */
  end() {
    if (!this.#response.writableEnded) {
      this.#response.write(this.#body);
      this.#response.end();
    }
    return this;
  }

  isEnded() {
    return this.#response.writableEnded;
  }
}
