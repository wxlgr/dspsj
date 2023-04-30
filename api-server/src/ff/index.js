const { FFCreatorCenter } = require("ffcreator");

/**
 * 
 * @param {*} taskFn 
 * @returns  [creator, taskId]
 */
function startFFTask(taskFn) {
  return FFCreatorCenter.addTask(()=>taskFn());
}

module.exports = {
  startFFTask,
  FFCreatorCenter
};
