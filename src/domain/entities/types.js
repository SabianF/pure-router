/**
 * @typedef {import("node:http").RequestListener} HandlerFunction
 * @typedef {import("../../data/models/router.js").default} Router
 */

/**
 * Any middleware can end early the response cycle by using {response.setWasHandled}
 * @callback ClientHandlerFunction
 * @param {import("node:http").IncomingMessage} request
 * @param {import("../../data/models/response.js").default} response
 */
