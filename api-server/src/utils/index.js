function linkUrls(...urls) {
    return urls.join('/')
}

/**
 * 
 * @param {Number} n default9 几位数
 * @returns 返回n位数的随机数字
 */
function uniqueSuffix(n = 9) {
    return '' + Math.round(Math.random() * 10 ** n)
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