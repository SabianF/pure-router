import http from "node:http";

export default class HttpLib {
  constructor() {
    this.createServer = http.createServer;
  }
}
