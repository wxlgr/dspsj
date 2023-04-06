const path = require('path');
const ffConfig = require('./ff.config')
const colors = require('colors')
const { FFScene, FFAlbum, FFText, FFCreator } = require('ffcreator');


const { width, height } = ffConfig

// 创建一个制作相册集视频的任务
const createAlbumFFTask = function ({
  imgs = [],
  imgDuration = 4,
  transitionTime = 3,
  // 马尔斯绿
  bgColor = '#01847f',
  bgm = './assets/bgm/乌云 - 董唧唧.mp3',
  txt = {}
}
) {

  // 合并文字配置
  txt = Object.assign({
    title: 'FFCreator 图集',
    color: 'gold',
    bgColor: 'transparent',
    fontSize: 24
  }, txt)


  const creator = new FFCreator(ffConfig)

  // create FFScene
  const scene = new FFScene();
  scene.setBgColor(bgColor);



  // 图集

  const album = new FFAlbum({
    list: imgs,   // 相册的图片集合
    x: width / 2,
    y: height / 2,
    width: width,
    height: height / 2,
    showCover: true
  });
  album.setTransition('random');      // 设置相册切换动画,默认就是随机

  album.setTransTime(transitionTime);             // 设置单张停留时长
  album.setDuration(imgDuration)
  scene.addChild(album);
  scene.setDuration(album.getTotalDuration() + 1)


  // 音频
  scene.addAudio({
    path: bgm,
    volume: 1,
    fadeIn: 1,
    fadeOut: 1.5
  })

  // 文字
  const fftext = new FFText({
    fontSize: txt.fontSize,
    text: txt.title,
    color: txt.color,
    backgroundColor: txt.bgColor,
    x: width / 2,
    y: height / 6 - txt.fontSize
  });
  fftext.addEffect('fadeInDown', 2, 1);         // 动画
  fftext.alignCenter(); // 文字居中
  fftext.setStyle({ padding: [6, 12] });   // 设置样式object

  console.log(txt);



  scene.addChild(fftext);
  creator.addChild(scene);
  creator.start();

  creator.on('start', () => {
    console.log(`FFCreator start`);
  });

  creator.on('progress', e => {
    console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
  });

  creator.on('complete', e => {
    console.log(colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `));

  });
  return creator;
}



module.exports = {createAlbumFFTask}
