const ffConfig = require('./ff.config')
const colors = require('colors')
const { FFScene, FFAudio, FFVideo, FFText, FFImage, FFCreator } = require('ffcreator');
const { getVideoDurationInSeconds } = require('get-video-duration')

const width = ffConfig.width, height = ffConfig.height;

// 创建一个制作带有bgm视频的任务
const createVideoGgmFFTask = async function ({
    videoPath='',
    bgmPath='',
    bgColor = '#01847f'
}) {
    const creator = new FFCreator(ffConfig)
    const scene = new FFScene()
    scene.setBgColor(bgColor)

    const video = new FFVideo({
        path: videoPath,
        width,
        height: 380,
        x: width / 2,
        y: height / 2,
        volume: false
    })

    if (bgmPath) {
        const bgm = new FFAudio({
            path: bgmPath,
            volume: 1.5
        })
        scene.addAudio(bgm)
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



module.exports = { createVideoGgmFFTask }
