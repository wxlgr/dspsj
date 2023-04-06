const bgmsRouter = new require('express').Router()
const { bgmsModel } = require('../mongoose/models/index')

// bgm新增
bgmsRouter.post('/add', async function (req, res) {
    const { author, bgmUrl, title } = req.body
    const bgm = await bgmsModel.create({
        author,
        bgmUrl,
        title
    })
    res.send({
        code: 0,
        result: bgm,
        msg: '新增成功'
    })

})


// 查找所有 并填充 author：根据uid返回具体User
bgmsRouter.get('/findAll', async function (req, res) {
    const bgms = await bgmsModel.find().populate('author', ['nickname'])
    res.send({
        code: 0,
        result: {
            bgms,
            totalCount: bgms.length
        },
        msg: '查询成功'
    })
})


// bgm分页查询
bgmsRouter.get('/findByPage', async function (req, res) {

    let { pageIndex = 1, pageSize = 5 } = req.query

    // 转为数字
    pageIndex = +pageIndex
    pageSize *= 1

    const totalCount = await bgmsModel.count()
    const list = await bgmsModel.find().skip((pageIndex - 1) * pageSize)
        .limit(pageSize)

    res.send({
        code: 0,
        result: {
            // 总数
            totalCount,
            // 总页数
            totolSize: Math.ceil(totalCount / pageSize),
            // 当前返回列表项数目
            listCount: list.length,
            // 第几页
            pageIndex,
            // 每页显示条数
            pageSize,
            // 列表数据
            list: list,
        },
        msg: '查询成功'
    })
})

// bgm修改

bgmsRouter.post('/update', async function (req, res) {
    const bgmObj = req.body
    const _id = req.body._id

    // 返回修改之后的文档
    const bgm = await bgmsModel.findByIdAndUpdate(_id, bgmObj, { returnDocument: 'after' })

    if (bgm) {
        res.send({
            code: 0,
            msg: "bgm修改成功",
            result: bgm
        })
    } else {
        res.send({
            code: 1,
            msg: "bgm不存在,修改失败",
            result: null
        })
    }
})


// 删除用户
bgmsRouter.post('/delete', async (req, res) => {
    // 用户id
    const _id = req.body._id

    const bgm = await bgmsRouter.findByIdAndDelete(_id)
    res.send({
        code: 0,
        result: bgm,
        msg: bgm ? '删除成功' : 'bgm不存在，删除失败'
    })
})



module['exports'] = bgmsRouter