const ffConfig = require("./ff.config");
const colors = require("colors");
const { FFScene, FFAudio, FFVideo, FFCreator } = require("ffcreator");
const { getVideoDurationInSeconds } = require("get-video-duration");

const width = ffConfig.width,
  height = ffConfig.height;

// 创建一个制作带有bgm视频的任务
const createVideoGgmFFTask = async function ({
  videoPath = "",
  bgmPath = "",
  bgColor = "#ccc",
}) {
  const creator = new FFCreator(ffConfig);
  const scene = new FFScene();
  scene.setBgColor(bgColor);
  const video = new FFVideo({
    path: videoPath,
    width,
    height,
    x: width / 2,
    y: height / 2,
  });

  if (bgmPath) {
    const bgm = new FFAudio({
      path: bgmPath,
      volume: 1,
    });

    // 去除原声
    // video.setAudio(false);
    scene.addAudio(bgm);
  }

  // 设置时长
  scene.setDuration(await getVideoDurationInSeconds(videoPath));
  scene.addChild(video);
  creator.addChild(scene);

  creator.start();

  return creator;
};

module.exports = { createVideoGgmFFTask };
