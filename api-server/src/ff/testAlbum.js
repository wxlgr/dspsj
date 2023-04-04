const {createAlbumFFTask} = require('./album')
const path = require('path')
const fs = require('fs')
const {startFFTask} = require('./index')
let imgs = []
for (let i = 1; i <= 6; i++) {
    imgs.push(path.join(__dirname, `./assets/imgs/album/0${i}.jpeg`));
}

startFFTask(() => createAlbumFFTask({
    imgs,
    // bgColor: '#6ab7b0',
    bgm: './assets/bgm/乌云 - 董唧唧.mp3',
    txt: {
        color:'gold',
        title:'我的图集'
    }

}))



