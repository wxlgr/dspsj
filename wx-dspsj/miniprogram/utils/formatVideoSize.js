const formatVideoSize = function (size = 0) {
  return (size / 1024).toFixed(2) + "MB"
}
export  {
  formatVideoSize
}