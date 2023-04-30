const { model } = require("mongoose");
const { userSchema, videoSchema, bgmSchema ,reportSchema} = require("../schemas/index");

const usersModel = model("User", userSchema, "users");
const videosModel = model("Video", videoSchema, "videos");
const bgmsModel = model("Bgm", bgmSchema, "bgms");

const reportsModel = model("Report", reportSchema, "reports");

module.exports = {
  usersModel,
  videosModel,
  bgmsModel,
  reportsModel
};