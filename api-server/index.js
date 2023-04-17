
const express = require('express')
const cors = require('cors')
const app = express()

const { port } = require('./src/config/app.config')


// 解析body
app.use(express.json())

// 解析表单中的 url-encoded 格式的数据
app.use(express.urlencoded({ extended: false }))

// 解决跨域
app.use(cors())

// 静态资源文件夹
app.use("/static", express.static('./static'))

// 检验token
const expressJWT = require('express-jwt');
app.use(
  expressJWT.expressjwt({
    secret: 'key',
    algorithms: ['HS256'],
    // 默认解析结果会赋值在 req.user，也可以通过 requestProperty 来修改：
    requestProperty: 'auth'
  })
    .unless({
      path: ['/api/v1/users/login', '/api/v1/users/register']
    })
)

const router = require('./src/router')
//挂载路由
app.use('/api/v1', router)





// 其他 404
app.use('*', (req, res) => {
  res.status(404).json({ code: 404, result: null, msg: "404 not found" })
})
// token校验失败 401
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ code: 401, result: null, msg: err?.message || '鉴权失败' })
  }
})



// 监听3000端口
app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`)
})



