const path = require('path');
const ffConfig = require('./ff.config')
const fs = require('fs');
const colors = require('colors')
const { FFCreatorCenter, FFScene, FFAudio, FFVideo, FFText, FFImage, FFCreator } = require('ffcreator');
const { getVideoDurationInSeconds } = require('get-video-duration')

const pathReslove = dir => path.join(__dirname, dir),
    width = ffConfig.width, height = ffConfig.height;

// 创建一个制作视频背景模糊的任务
const createBlurFFTask = async function ({
    videoPath,
    bgm = '',
    bgColor = '#252526',
    // 有无模糊
    blur = 0
}) {

    const creator = new FFCreator(ffConfig)
    const scene = new FFScene()
    scene.setBgColor(bgColor)

    const video = new FFVideo({
        path: videoPath,
        width,
        width: width,
        height: 380,
        x: width / 2,
        y: height / 2,
        volume: false
    })

    // 背景音乐
    if (bgm) {
        video.setAudio(false)
        scene.addAudio(new FFAudio({
            path: bgm,
            volume: 1,
            fadeIn: 1,
            fadeOut: 1.5
        }))
    }

    if (blur) {
        videos.setBlur(2)
    }

    // 设置时长
    scene.setDuration(await getVideoDurationInSeconds(videoPath))
    scene.addChild(video)
    creator.addChild(scene)


    // 开始渲染
    creator.start()

    creator.on('start', () => {
        console.log(`FFCreator start`);
    });

    creator.on('progress', e => {
        console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
    });

    creator.on('complete', e => {
        console.log(colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `));

    });
    return creator
}



module.exports = {createBlurFFTask}
