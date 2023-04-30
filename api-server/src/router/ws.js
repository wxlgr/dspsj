const { Server } = require("ws");
const express = require("express");
const wss = new Server({
  server: express().listen(8080),
});
module.exports = wss;
