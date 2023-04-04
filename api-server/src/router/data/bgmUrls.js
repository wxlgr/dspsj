const path = require('path');
const bgms = [
    '轻快活泼.mp3',
    '清新欢乐.mp3',
    '乌云-董唧唧.mp3',
    '喜庆-喜洋洋.mp3',
    '鼓舞人心激励前进.mp3'
]

const { STATIC_PATH } = require('../../config/app.config')

const bgmBase = STATIC_PATH + '/assets/bgm/'

const bgmUrls = bgms.map(bgm => {
    return {
        name: path.parse(bgm).name,
        bgmUrl: bgmBase + bgm
    }
})

module.exports = bgmUrls
