/**
 * @typedef {import("node:http").RequestListener} HandlerFunction
 * @typedef {import("../../data/models/router.js").default} Router
 * @typedef {import("node:http").IncomingMessage} HttpRequest
 * @typedef {import("../../data/models/response.js").default} ResponseModel
 */

/**
 * Request & middleware handlers. To prevent further handlers from being called
 * & end the response, call {response.setWasHandled}
 * @callback ClientHandlerFunction
 * @param {HttpRequest} request
 * @param {ResponseModel} response
 */
