const userRouter = new require('express').Router()
const { usersModel } = require('../mongoose/models/index')
const jwt = require('jsonwebtoken');

// 注册
userRouter.post('/register', async function (req, res) {

    const { username } = req.body
    let hasData = await usersModel.findOne({ username })

    // 检测用户名是否已存在
    if (hasData) {
        return res.send({
            code: 1,
            result: null,
            msg: '用户名已存在'
        })
    }
    // 初次注册
    usersModel.create(req.body).then(data => {
        res.send({
            code: 0,
            result: data,
            msg: '注册成功'
        })
    }).catch(err => {
        res.send({
            code: 1,
            result: null,
            msg: err.message
        })
    });
})

// 登录
userRouter.post('/login', async function (req, res) {
    let { username = '', nickname = '', password } = req.body

    usersModel.findOne({
        // 通过用户名或者昵称
        $or: [{ username }, { nickname }],
        password: password
    }).then(data => {
        if (data) {
            // 登录成功，返回token

            const token = 'Bearer ' + jwt.sign({
                data: { username, password }
            }, 'key', { expiresIn: '1h' })
            res.send({
                code: 0,
                token,
                result: data,
                msg: '登录成功'
            })
        } else {
            // 登录失败
            res.send({
                code: 1,
                result: data,
                msg: '登录失败'
            })
        }

    })
})


// 查询用户信息
userRouter.get('/findById', async function (req, res) {

    // 用户id
    let _id = req.body._id
    usersModel.findById(_id).then(data => {
        if (data) {
            res.send({
                code: 0,
                result: data,
                msg: '查询成功'
            })
        } else {
            res.send({
                code: 1,
                result: null,
                msg: '查询失败'
            })
        }
    })
})


// 修改用户信息
userRouter.post('/update', async function (req, res) {

    // 新的用户信息对象
    let newUserInfo = req.body
    // 用户id
    let _id = req.body._id
    // 剔除
    // delete newInfo._id

    usersModel.findOneAndUpdate(
        {
            _id: _id
        },
        newUserInfo,
        {
            // 返回更新后的文档
            returnDocument: 'after'
        }
    ).then(data => {
        res.send({
            code: 0,
            result: data,
            msg: '修改成功'
        })
    }).catch(err => {
        res.send({
            code: 1,
            result: null,
            msg: err.message
        })
    });
})

// 删除用户
userRouter.post('/delete', async (req, res) => {
    // 用户id
    const _id = req.body._id

    usersModel.findByIdAndDelete(_id).then(data => {
        if (data) {
            res.send({
                code: 0,
                result: data,
                msg: '删除成功'
            })
        } else {
            res.send({
                code: 1,
                result: data,
                msg: '删除失败'
            })
        }

    })
})

module.exports = userRouter

