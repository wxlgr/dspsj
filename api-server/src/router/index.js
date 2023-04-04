const { Router } = require("express");
const router = new Router();
const userRouter = require('./users.router')
const videoRouter = require('./videos.router')
const uploadRouter = require('./upload.router')

router.use('/users',userRouter)
router.use('/videos',videoRouter)
router.use('/upload',uploadRouter)


module.exports = router