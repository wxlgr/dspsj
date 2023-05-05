// 千分位
function formatNumberString(num) {
  num = "" + num;
  let reg = /\d(?=(\d{3})+$)/g;
  return num.replace(reg,'$&,');
}

export {
    formatNumberString
}