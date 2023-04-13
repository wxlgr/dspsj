function linkUrls(...urls) {
  return urls.join("/");
}

/**
 *
 * @param {Number} n default:8 几位数
 * @returns 返回n位数的随机数字
 */
function uniqueSuffix(n = 8) {
  let str = "" + Math.round(Math.random() * 10 ** n);
  // 确保位数
  while (str.length !== n) {
    str = "" + Math.round(Math.random() * 10 ** n);
  }
  return str;
}

const fs = require("fs");
const path = require("path");
function removeFile(fpath) {
  fpath = path.resolve(__dirname, "../../", fpath);
  let dir = path.dirname(fpath);

  try {
    fs.unlinkSync(fpath);
    if (fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
      console.log(`空文件夹 ${dir}已删除`);
    }
    console.log(fpath, "删除成功");
  } catch (e) {
    console.log(fpath, "文件不存在");
  }
}

module.exports = {
  linkUrls,
  uniqueSuffix,
  removeFile,
};
