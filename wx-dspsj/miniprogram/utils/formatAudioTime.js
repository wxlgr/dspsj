function formatAudioTime(num) {
  let minute = '' + Math.floor(num / 60)
  let second = '' + Math.floor(num % 60)

  return padLeftZero(minute) + ':' + padLeftZero(second)
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
};

export {
  formatAudioTime
}

// console.log(formatAudioTime(133.184159)) 02:13