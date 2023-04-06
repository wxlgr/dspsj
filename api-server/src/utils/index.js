function linkUrls(...urls) {
    return urls.join('/')
}

/**
 * 
 * @param {Number} n default:8 几位数
 * @returns 返回n位数的随机数字
 */
function uniqueSuffix(n =8) {
    let str =''+ Math.round(Math.random() * (10 ** n))
    // 确保位数
    while(str.length!==n){
        str =''+ Math.round(Math.random() * (10 ** n))
    }
    return str
}


const fs = require('fs')
function removeFile(fpath) {
    fpath = 'static' + fpath.split('/static')[1]
    try {
        fs.unlinkSync(fpath)
        console.log(fpath)
    } catch (e) {
        console.log('文件不存在')
    }

}



module.exports = {
    linkUrls,
    uniqueSuffix,
    removeFile
}