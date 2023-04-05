const express = require('express')
const cors = require('cors')
const app = express()

const path = require('path')

// 解析body
app.use(express.json())

// 解析表单中的 url-encoded 格式的数据
app.use(express.urlencoded({ extended: false }))

// 解决跨域
app.use(cors())

const router = require('./src/router')
//挂载路由
app.use('/api/v1', router)
// 静态资源文件夹
app.use("/static", express.static('./static'))


// 其他
app.use('*', (req, res) => {
  res.status(404).json({ code: 1, result: null, msg: "not found" })
})



// 监听3000端口
app.listen(3000, () => {
  console.log(`api-server listening at http://localhost:3000`)
})