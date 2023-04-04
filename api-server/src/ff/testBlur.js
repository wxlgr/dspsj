const {createBlurFFTask} = require('./blur')
const path = require('path')
const fs = require('fs')

const { startFFTask } = require('./index')

startFFTask(() => createBlurFFTask({
    videoPath: './assets/video/video1.mp4',
    bgm: './assets/bgm/轻快活泼美食广告视频娱乐愉快小清新配乐_爱给网_aigei_com.mp3'
}))



