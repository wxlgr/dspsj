const ffConfig = require('./ff.config')
const colors = require('colors')
const { FFScene, FFAudio, FFVideo, FFText, FFImage, FFCreator } = require('ffcreator');
const { getVideoDurationInSeconds } = require('get-video-duration')

const { width, height } = ffConfig
const path = require('path')

let bgmPath = '../../static/assets/bgm/乌云-董唧唧.mp3',
    videoPath = path.join(__dirname, '../../static/assets/video/video1.mp4'),
    bgColor = '#01847f'

async function testVideoBgm() {
    const creator = new FFCreator(ffConfig)
    creator.setOutput('./testffout/videoBgm.mp4')
    const scene = new FFScene()
    scene.setBgColor(bgColor)

    const video = new FFVideo({
        path: videoPath,
        width,
        height,
        // height: 380,
        x: width / 2,
        y: height / 2,
    })


    if (bgmPath) {
        const bgm = new FFAudio({
            path: bgmPath,
            volume: 1
        })

        // 去除原声
        video.setAudio(false)
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
}

testVideoBgm()