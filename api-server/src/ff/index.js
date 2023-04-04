const { FFCreatorCenter } = require('ffcreator')
// 添加任务的函数
function startFFTask(ffTaskFN) {
    return FFCreatorCenter.addTask(ffTaskFN);
}

module.exports = { startFFTask, FFCreatorCenter }