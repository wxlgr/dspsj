const { createVideoGgmFFTask } = require("../videoBgm");
const { startFFTask, FFCreatorCenter } = require("../index");
function run() {

  const taskId = FFCreatorCenter.addTask(() =>
    createVideoGgmFFTask({
      videoPath: "./video2.mp4",
      bgmPath: "./乌云-董唧唧.mp3",
    })
  );

  console.log(taskId, 111);
  FFCreatorCenter.onTask(taskId, 'progress', (e) => {
    console.log(e, 222);
  });

  FFCreatorCenter.onTaskComplete(taskId, (result) => {
    console.log(result.file);
  });

  FFCreatorCenter.onTaskError(taskId, (error) => {
    console.log(error)
    
  })
}
run();
