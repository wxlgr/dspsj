const path = require('path');
const cacheDir = path.join(__dirname, './cache');
const outputDir = path.join(__dirname, '../../static/ffout');

const ffConfig = {
    cacheDir,                 // 缓存目录
    outputDir,                // 输出目录
    width: 500,               // 影片宽
    height: 680,              // 影片高
    audioLoop: true,          // 音乐循环
    threads: 8,               // 多线程(伪造)并行渲染
    render:'gl',
    
}

module.exports = ffConfig