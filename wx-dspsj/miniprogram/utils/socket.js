// 发送taskId，得到服务器返回数据，自动调用回调函数cb

function askTask(obj, cb) {
  const ws = wx.connectSocket({
    url: "ws://localhost:8080",
  });
  ws.onOpen(() => {
    console.log('链接成功');
    ws.send({
      data: JSON.stringify(obj)
    })
  })
  ws.onClose(() => {
    console.log('链接关闭');
  })
  ws.onMessage(({
    data
  }) => {
    const msg = JSON.parse(data)
    cb(msg)
  })
}
export default {
  askTask
}