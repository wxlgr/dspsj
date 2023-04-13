const { model } = require("mongoose");
const { userSchema, videoSchema, bgmSchema } = require("../schemas/index");

const usersModel = model("User", userSchema, "users");
const videosModel = model("Video", videoSchema, "videos");
const bgmsModel = model("Bgm", bgmSchema, "bgms");

module.exports = {
  usersModel,
  videosModel,
  bgmsModel,
};