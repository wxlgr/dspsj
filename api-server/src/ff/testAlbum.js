let photos = ["http://localhost:3000/static/uploads/photos/20230406/20230406_010142_944522554_01.jpeg",
    "http://localhost:3000/static/uploads/photos/20230406/20230406_010142_307342_02.jpeg",
    "http://localhost:3000/static/uploads/photos/20230406/20230406_010142_714246306_03.jpeg",
    "http://localhost:3000/static/uploads/photos/20230406/20230406_010142_95672570_04.jpeg",
    "http://localhost:3000/static/uploads/photos/20230406/20230406_010142_911591087_05.jpeg",
    "http://localhost:3000/static/uploads/photos/20230406/20230406_010142_504801802_06.jpeg"]

const ffConfig = require('./ff.config')
const { FFScene, FFAlbum, FFText, FFCreator } = require('ffcreator');
const colors = require('colors')
const { width, height } = ffConfig

console.log(ffConfig)


const album = new FFAlbum({
    list: photos,
    x: width / 2,
    y: height / 2,
    width: width,
    height: height / 2,
    showCover: true
})



album.setTransition('random');      // 设置相册切换动画,默认就是随机

album.setDuration(3);             // 设置单张停留时长
album.setTransTime(2);            // 设置单张动画时长
const creator = new FFCreator(ffConfig)
creator.setOutput('./testffout/album.mp4')
// create FFScene
const scene = new FFScene();

scene.setBgColor('#ff6700');
scene.addChild(album);
scene.setDuration(album.getTotalDuration())


// 音频
creator.addAudio({
    path: '../../static/assets/bgm/清新欢乐.mp3',
  
})
const txt = {
    fontSize: 24,
    title: '测试',
    color: '#ffffff',
    bgColor: '#ff6700',
}
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